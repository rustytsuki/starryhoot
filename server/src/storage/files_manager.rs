use serde::{Deserialize, Serialize};
use std::{
    fmt::Result,
    fs, io,
    path::{Path, PathBuf},
};

use crate::{db::{file::File, DB}, utils::get_files_path};

#[derive(Serialize, Deserialize)]
pub struct FileInfo {
    #[serde(rename = "id")]
    id: i64,
    #[serde(rename = "title")]
    title: String,
    #[serde(rename = "mtime")]
    modify_time: i64,
}

pub async fn load_files(user_id: i64) -> Option<Vec<FileInfo>> {
    if let Some(files) = DB::inst().file_query_by_user(user_id).await {
        let mut files_info = Vec::new();
        for file in files {
            files_info.push(get_file_info(&file));
        }

        return Some(files_info);
    }

    None
}

pub async fn load_file(user_id: i64, fid: i64) -> Option<FileInfo> {
    if let Some(file) = DB::inst().file_query_by_id(fid).await {
        if file.user == user_id {
            return Some(get_file_info(&file));
        }
    }

    None
}

pub fn get_file_info(file: &File) -> FileInfo {
    FileInfo {
        id: file.id,
        title: file.title.clone(),
        modify_time: file.modify_time.timestamp(),
    }
}

pub async fn open_file_folder(fid: i64) {
    let mut file_folder_path = get_files_path();
    file_folder_path.push(&format!("{}", fid));

    crate::utils::open_shell_folder(&file_folder_path).await;
}

pub async fn create_new_file(_user_id: i64, _title: &str) -> Option<FileInfo> {
    None
}

pub async fn delete_user_file(user_id: i64, fid: i64) -> bool {
    if DB::inst().file_delete_by_user(user_id, fid).await {
        return delete_file_storage(fid).await;
    }

    false
}

async fn delete_file_storage(fid: i64) -> bool {
    let file_id = format!("{}", &fid);
    let mut file_folder_path = get_files_path();
    file_folder_path.push(file_id);
    if let Ok(file_folder_path) = crate::utils::to_abs_path(file_folder_path) {
        if let Ok(_) = tokio::fs::remove_dir_all(file_folder_path).await {
            return true;
        }
    }

    return false;
}

pub fn get_file_unpack_tree(file_id: i64, json: &mut serde_json::Value) -> bool {
    fn read_dir(p: &Path, json: &mut serde_json::Value) -> bool {
        match fs::read_dir(p) {
            Ok(entries) => {
                for entry in entries {
                    let path = entry.unwrap().path();
                    let name = path.file_name().unwrap().to_str().unwrap();
                    if path.is_dir() {
                        json[name] = serde_json::json!({});
                        read_dir(&path, &mut json[name]);
                    } else {
                        json[name] = serde_json::json!(true);
                    }
                }
            }
            Err(_) => {
                return false;
            }
        }

        true
    }

    let mut unpack_path = get_files_path();
    unpack_path.push(file_id.to_string());
    unpack_path.push("unpacked");

    read_dir(&unpack_path, json)
}

pub async fn upload_file(user_id: i64, file_name: String, data: impl AsRef<[u8]>) -> Option<FileInfo> {
    if let Some(file_info) = DB::inst().file_insert(user_id, &file_name).await {
        let file_id = file_info.id;

        // storage/fid
        let mut file_dir_path = get_files_path();
        file_dir_path.push(file_id.to_string());
        if !crate::utils::ensure_dir(&file_dir_path) {
            delete_user_file(user_id, file_id).await;
            return None;
        }

        // storage/fid/uploaded.docx
        let mut file_path = PathBuf::from(&file_dir_path);
        file_path.push("uploaded.docx");
        if let Err(_) = tokio::fs::write(&file_path, data).await {
            delete_user_file(user_id, file_id).await;
            return None;
        }

        // unzip file
        let file = fs::File::open(&file_path).unwrap();

        let mut archive = zip::ZipArchive::new(file).unwrap();

        let mut unpack_path = PathBuf::from(&file_dir_path);
        unpack_path.push("unpacked");
        for i in 0..archive.len() {
            let mut file = archive.by_index(i).unwrap();
            let mut outpath = PathBuf::from(&unpack_path);
            let archive_path = match file.enclosed_name() {
                Some(path) => path.to_owned(),
                None => continue,
            };
            outpath.push(archive_path);

            {
                let comment = file.comment();
                if !comment.is_empty() {
                    println!("File {} comment: {}", i, comment);
                }
            }

            if (*file.name()).ends_with('/') {
                println!("File {} extracted to \"{}\"", i, outpath.display());
                fs::create_dir_all(&outpath).unwrap();
            } else {
                println!("File {} extracted to \"{}\" ({} bytes)", i, outpath.display(), file.size());
                if let Some(p) = outpath.parent() {
                    if !p.exists() {
                        fs::create_dir_all(&p).unwrap();
                    }
                }
                let mut outfile = fs::File::create(&outpath).unwrap();
                io::copy(&mut file, &mut outfile).unwrap();
            }

            // Get and Set permissions
            #[cfg(unix)]
            {
                use std::os::unix::fs::PermissionsExt;

                if let Some(mode) = file.unix_mode() {
                    fs::set_permissions(&outpath, fs::Permissions::from_mode(mode)).unwrap();
                }
            }
        }

        return Some(get_file_info(&file_info));
    }

    None
}
