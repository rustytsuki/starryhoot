use std::ffi::{c_char, c_int, c_void};

extern "C" {
    // cli
    pub fn roffice_set_shell_build_info(text: *const c_char) -> c_void;
    pub fn roffice_cli(argc: c_int, argv: *const *const c_char) -> c_int;
}
