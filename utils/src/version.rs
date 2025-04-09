use serde::Deserialize;
use serde_json::{json, Value};

#[cfg(feature = "production")]
use rust_embed::{EmbeddedFile, RustEmbed};

#[cfg(feature = "production")]
#[derive(RustEmbed)]
#[folder = "../deploy/version"]
#[exclude = ".DS_Store"]
#[exclude = "version_template.json"]
struct Asset;

#[derive(Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct Version {
    pub ver_major: String,
    pub ver_minor: String,
    pub ver_patch: String,
    pub architecture: String,
    pub build_time: String,
}

#[cfg(feature = "production")]
fn parse_version() -> Option<Version> {
    let content = Asset::get("version.json")?;
    let json_str = std::str::from_utf8(content.data.as_ref()).ok()?;
    let version: Version = serde_json::from_str(json_str).ok()?;

    Some(version)
}

pub fn get_version() -> Option<Version> {
    #[cfg(feature = "production")]
    return parse_version();

    #[cfg(not(feature = "production"))]
    return None;
}