use std::ffi::{c_char, c_int};

extern "C" {
    // cli
    pub fn roffice_cli(argc: c_int, argv: *const *const c_char) -> c_int;
}
