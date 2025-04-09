#![allow(dangling_pointers_from_temporaries)]

use std::ffi::CString;

use utils::ffi::{roffice_cli, roffice_override_build_info};

fn main() -> Result<(), i32> {
    if let Some(version) = utils::version::get_version() {
        let ver = format!("v{}.{}.{}", version.ver_major, version.ver_minor, version.ver_patch);
        unsafe {
            roffice_override_build_info(
                CString::new(ver.as_str()).unwrap().as_ptr(),
                CString::new("").unwrap().as_ptr(),
                CString::new("").unwrap().as_ptr(),
            );
        }
    }

    let arguments: Vec<_> = std::env::args().collect();
    let argv_cstring: Vec<_> = arguments.iter().map(|arg| CString::new(arg.as_str()).unwrap()).collect();

    let argv: Vec<_> = argv_cstring.iter().map(|arg| arg.as_ptr()).collect();

    

    let result = unsafe { roffice_cli(argv.len() as i32, argv.as_ptr()) };

    if 0 == result {
        return Ok(());
    }

    Err(result)
}
