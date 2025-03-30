use axum::{Router, body::Body};
use tower_http::services::ServeDir;

pub fn route(app: Router) -> Router {
    app.nest_service("/storage", ServeDir::new("./data/server/storage/files"))
}
