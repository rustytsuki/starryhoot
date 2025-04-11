use lazy_static::lazy_static;

#[cfg(not(feature = "production"))]
mod reverse_proxy;

#[cfg(feature = "production")]
mod static_pages;

use crate::config;
use axum::body::Body;
use axum::extract::{Extension, Request};
use axum::response::{Html, Redirect, Response};
use axum::routing::get;
use axum::Router;
use hyper_util::{client::legacy::connect::HttpConnector, rt::TokioExecutor};

type Client = hyper_util::client::legacy::Client<HttpConnector, Body>;

pub fn route(app: Router) -> Router {
    let app = app.route("/", get(|| async { Redirect::temporary("/home") }));

    #[cfg(feature = "production")]
    {
        static_pages::route(app)
    }

    #[cfg(not(feature = "production"))]
    {
        reverse_proxy::route(app)
    }
}
