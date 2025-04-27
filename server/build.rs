use std::path::Path;
extern crate embed_resource;

fn main() {
    println!("cargo:rerun-if-changed=version.rc");
    if Path::new("version.rc").exists() {
        embed_resource::compile("version.rc", embed_resource::NONE).manifest_optional().unwrap();
    } else {
        println!("cargo:warning=version.rc not found, skipping resource embedding.");
    }
}
