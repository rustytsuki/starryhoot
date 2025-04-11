use axum::{Router, body::Body};
use tower_http::services::ServeDir;

use crate::utils::get_files_path;

pub fn route(app: Router) -> Router {
    app.nest_service("/storage", ServeDir::new(get_files_path()))
}
