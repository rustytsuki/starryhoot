// use axum_database_sessions::AxumSession;

use axum_session::{Session, SessionSqlitePool};

pub async fn set_user_id(session: &Session<SessionSqlitePool>, user_id: i64) {
    session.set("user-id", user_id);
}

pub async fn remove_user_id(session: &Session<SessionSqlitePool>) {
    session.remove("user-id");
}

pub async fn get_user_id(session: &Session<SessionSqlitePool>) -> Option<i64> {
    session.get::<i64>("user-id")
}

pub async fn set_user_name(session: &Session<SessionSqlitePool>, user_name: &str) {
    session.set("user-name", user_name);
}

pub async fn remove_user_name(session: &Session<SessionSqlitePool>) {
    session.remove("user-name");
}

pub async fn get_user_name(session: &Session<SessionSqlitePool>) -> Option<String> {
    session.get::<String>("user-name")
}