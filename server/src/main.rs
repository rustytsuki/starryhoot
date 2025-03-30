#![allow(dead_code, unused_variables, unused_imports, unused_unsafe, unused_assignments)]
#![allow(non_snake_case, non_camel_case_types, non_upper_case_globals)]
#![allow(dangling_pointers_from_temporaries)]

use clap::Parser;
use axum::{response::Html, routing::get, Router, Extension, body::Body};
// use axum_database_sessions::{AxumSessionConfig, AxumSessionStore, AxumSessionLayer};
use axum_session::{SessionConfig, SessionStore, SessionLayer, SessionSqlitePool};
use hyper_util::{client::legacy::connect::HttpConnector, rt::TokioExecutor};

type Client = hyper_util::client::legacy::Client<HttpConnector, Body>;

mod router;
mod storage;
mod utils;
mod args;
mod config;
mod db;
mod session;

#[tokio::main]
async fn main() {
    // args
    let args = args::Args::parse();

    // config
    if let Err(why) = config::load(args.config.as_str(), &args) {
        println!("error occured when loading config.ini.\n{}\nuse default config value", why);
    }

    // init db
    db::DB::connect().await;
    let db = db::DB::inst();
    db.migrate().await;
    let pool = SessionSqlitePool::from(db.pool.clone());

    // init session
    let session_config = SessionConfig::default()
    .with_table_name("session");

    let session_store = SessionStore::new(Some(pool), session_config).await.unwrap();

    // init server
    let client: Client =
        hyper_util::client::legacy::Client::<(), ()>::builder(TokioExecutor::new())
            .build(HttpConnector::new());

    let mut app = Router::new();
    app = router::static_files::route(app);
    app = router::auth::route(app);
    app = router::drive::route(app);
    app = router::pages::route(app);
    app = app
        .route("/ping", get(handler_ping))
        .layer(Extension(client))
        .layer(SessionLayer::new(session_store));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:4080")
        .await
        .unwrap();
    println!("listening on http://{}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn handler_ping() -> Html<&'static str> {
    Html("<h1>pong</h1>")
}
