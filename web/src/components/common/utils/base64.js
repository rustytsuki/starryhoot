// UTF-8 string to base64 encoded ascii
export function str_to_base64(str) {
    return btoa(encodeURIComponent(str));
}
// base64 encoded ascii to UTF-8 string
export function base64_to_str(str) {
    return decodeURIComponent(atob(str));
}