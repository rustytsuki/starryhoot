#![allow(dangling_pointers_from_temporaries)]

use std::ffi::CString;

use utils::ffi::roffice_cli;

fn main() -> Result<(), i32> {
    let arguments: Vec<_> = std::env::args().collect();
    let argv_cstring: Vec<_> = arguments.iter().map(|arg| CString::new(arg.as_str()).unwrap()).collect();

    let argv: Vec<_> = argv_cstring.iter().map(|arg| arg.as_ptr()).collect();
    let result = unsafe { roffice_cli(argv.len() as i32, argv.as_ptr()) };

    if 0 == result {
        return Ok(());
    }
    
    Err(result)
}
