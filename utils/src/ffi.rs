use std::ffi::{c_char, c_int, c_void};

extern "C" {
    // cli
    pub fn roffice_override_build_info(ver: *const c_char, arch: *const c_char, date: *const c_char) -> c_void;
    pub fn roffice_cli(argc: c_int, argv: *const *const c_char) -> c_int;
}
