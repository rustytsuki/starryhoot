use axum::{
    extract::{Extension, Request},
    response::{Html, Response, IntoResponse},
    http::{StatusCode, Uri},
    routing::get,
    Router, body::Body,
};
use std::convert::TryFrom;
use http_body_util::BodyExt;
use hyper_util::{client::legacy::connect::HttpConnector, rt::TokioExecutor};

type Client = hyper_util::client::legacy::Client<HttpConnector, Body>;

pub fn route(app: Router) -> Router {
    app.fallback(get(handler_vike_dev))
}

pub async fn handler_vike_dev(Extension(client): Extension<Client>, mut req: Request) -> Response {
    let path = req.uri().path();
    let query = req.uri().query();
    let path_query = req.uri().path_and_query().map(|v| v.as_str()).unwrap_or(path);

    let uri = format!("http://127.0.0.1:65432{}", path_query);

    *req.uri_mut() = Uri::try_from(uri).unwrap();
    match client.request(req).await {
        Ok(resp) => {
            return resp.into_response();
        }
        Err(why) => {
            return Response::new(Body::from(format!("request error: {}", why)));
        }
    }
}
