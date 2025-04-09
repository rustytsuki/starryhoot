use axum::{
    http::{header, StatusCode, Uri},
    response::{Html, IntoResponse, Redirect, Response},
    routing::get,
    Router,
};
use rust_embed::{EmbeddedFile, RustEmbed};
use std::path::PathBuf;
use tokio::fs;
use tower_http::services::ServeDir;

#[derive(RustEmbed)]
#[folder = "../web/dist/client"]
#[exclude = ".DS_Store"]
struct Asset;

pub fn route(app: Router) -> Router {
    app.route("/*file", get(embeded_handler))
        .fallback(get(|| async { Redirect::permanent("/404") }))
}

async fn embeded_handler(uri: Uri) -> Response {
    let path_decoded = percent_encoding::percent_decode(uri.path().as_bytes())
        .decode_utf8()
        .unwrap()
        .to_string();
    
    println!("try to route uri: {}", &path_decoded);

    let mut path_slices: Vec<&str> = path_decoded.split('/').filter(|&s| !s.is_empty()).collect();
    if path_slices.is_empty() {
        // path is "/"
        println!("route uri is root: use /index.html");
        path_slices.push("index.html");
    }

    let path = path_slices.join("/");

    let mut file_path = path.clone();
    let mut file = Asset::get(&file_path);

    if file.is_none() {
        file_path = path.clone() + "/index.html";
        file = Asset::get(&file_path);
        if file.is_some() {
            println!("route uri /{} not found: fallback to /{}", &path, &file_path);
        }
    }
    if file.is_none() {
        file_path = path.clone() + ".html";
        file = Asset::get(&file_path);
        if file.is_some() {
            println!("route uri /{} not found: fallback to /{}", &path, &file_path);
        }
    }

    match file {
        Some(content) => {
            let mime = mime_guess::from_path(&file_path).first_or_octet_stream();
            ([(header::CONTENT_TYPE, mime.as_ref())], content.data).into_response()
        }
        None => Redirect::permanent("/404").into_response(),
    }
}
