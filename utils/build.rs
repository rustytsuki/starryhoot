#![allow(dead_code, unused_variables, unused_imports, unused_unsafe)]
#![allow(non_snake_case, non_camel_case_types, non_upper_case_globals)]

use std::{env, fs, path::{Path, PathBuf}};

use downloader::Downloader;
use flate2::read::GzDecoder;
use tar::Archive;

#[path = "src/version.rs"]
mod kernel_version;

const VERBOSE: bool = false;

fn print_warn(text: &str) {
    if VERBOSE {
        println!("cargo:warning={}", text);
    }
}

fn main() {
    let target = env::var("TARGET").unwrap();
    let host = env::var("HOST").unwrap();
    let target_os = env::var("CARGO_CFG_TARGET_OS").unwrap();

    // fetch_kernel_release("wasm32-unknown-emscripten".into());
    // fetch_kernel_release(target);

    set_roffice_lib();
}

fn set_roffice_lib() {
    let target = env::var("TARGET").unwrap();
    let host = env::var("HOST").unwrap();
    let target_os = env::var("CARGO_CFG_TARGET_OS").unwrap();

    if VERBOSE {
        // you have to add cargo -vv to show this warnning message!
        print_warn(&format!("CARGO_MANIFEST_DIR: {}", env::var("CARGO_MANIFEST_DIR").unwrap()));
        print_warn(&format!("OUT_DIR: {}", env::var("OUT_DIR").unwrap()));
        print_warn(&format!("TARGET: {}", target));
        print_warn(&format!("PROFILE: {}", env::var("PROFILE").unwrap()));
        print_warn(&format!("HOST: {}", host));
        print_warn(&format!("CARGO_CFG_TARGET_OS: {}", target_os));
    }

    let lib_search = get_roffice_lib_search();
    let bin_search = get_roffice_bin_search();
    println!("cargo:rustc-link-search=native={}", lib_search.to_str().unwrap());
    println!("cargo:rustc-link-lib=dylib=roffice");
}

fn get_roffice_lib_search() -> PathBuf {
    let mut roffice_lib_search = get_kernel_path();
    roffice_lib_search.push("lib");

    roffice_lib_search
}

fn get_roffice_bin_search() -> PathBuf {
    let mut roffice_bin_search = get_kernel_path();

    let target = env::var("TARGET").unwrap();
    if target.find("windows").is_some() {
        roffice_bin_search.push("bin");
    } else {
        roffice_bin_search.push("lib");
    }

    roffice_bin_search
}

fn get_deploy_path() -> PathBuf {
    let path = env::var("CARGO_MANIFEST_DIR").unwrap();
    let mut file_path = PathBuf::from(PathBuf::from(path.clone()).parent().unwrap());
    file_path.push("deploy");
    file_path.push("roffice");
    ensure_dir(&file_path);
    file_path
}

fn get_kernel_path() -> PathBuf {
    let target = env::var("TARGET").unwrap();
    let mut kernel = get_deploy_path();
    kernel.push(target);

    kernel
}

fn ensure_dir(dir: &PathBuf) -> bool {
    if dir.is_dir() {
        return true;
    }

    if !dir.exists() {
        if let Ok(_) = fs::create_dir_all(&dir) {
            return true;
        }
    }

    return false;
}

fn fetch_kernel_release(target: String) {
    let is_tar_gz = !target.find("wasm32").is_some() && !target.find("windows").is_some();
    let ext = if is_tar_gz { "tar.gz" } else { "zip" };

    let file_name = format!(
        "roffice-v{}-{}-{}.{}",
        kernel_version::VER,
        kernel_version::HASH,
        target,
        ext
    );
    let url = format!(
        "https://github.com/rustytsuki/roffice/releases/download/v{}/{}",
        kernel_version::VER,
        &file_name
    );

    let mut file_path = get_deploy_path();
    let build_folder = file_path.clone();
    file_path.push(&file_name);
    println!("cargo:rerun-if-changed={}", file_path.to_str().unwrap());

    // download file
    if !file_path.exists() {
        let mut downloader = Downloader::builder()
            .download_folder(&build_folder)
            .parallel_requests(1)
            .build()
            .unwrap();

        let dl = downloader::Download::new(&url);

        match downloader.download(&[dl]) {
            Ok(result) => {
                for r in result {
                    match r {
                        Ok(s) => print_warn(&format!("Success: {}", &s)),
                        Err(e) => {
                            if file_path.exists() {
                                fs::remove_file(file_path.as_path()).unwrap();
                            }
                            panic!("Error: {}", e.to_string());
                        }
                    };
                }
            }
            Err(e) => {
                if file_path.exists() {
                    fs::remove_file(file_path.as_path()).unwrap();
                }
                panic!("Error: {}", e.to_string());
            }
        }
    }

    // unzip file
    let kernel_path = get_kernel_path();
    println!("cargo:rerun-if-changed={}", kernel_path.to_str().unwrap());
    if kernel_path.exists() {
        fs::remove_dir_all(&kernel_path).unwrap();
    }
    if is_tar_gz {
        let tar_gz = fs::File::open(file_path).unwrap();
        let tar = GzDecoder::new(tar_gz);
        let mut archive = Archive::new(tar);
        archive.unpack(&build_folder).unwrap();
    } else {
        let zip_file = fs::File::open(file_path).unwrap();
        zip_extract::extract(zip_file, &build_folder, false).unwrap();
    }
}