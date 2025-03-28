import { navigate } from 'vike/client/router';

// navi client rout, route is pages route without base in vite.config.js
export function goto(route) {
    navigate(get_full_path(route));
}

// refresh browser, route is pages route without base in vite.config.js
export function redirect(route) {
    window.location.href = get_full_path(route);
}

// return current route without base in vite.config.js
export function get_current_route(pageContext) {
    const { urlPathname } = pageContext;
    return urlPathname;
}

// return current full path with base in vite.config.js
export function get_current_full_path(pageContext) {
    const { urlPathname } = pageContext;
    return get_full_path(urlPathname);
}

// return full path with base in vite.config.js
export function get_full_path(route) {
    const basePath = import.meta.env.BASE_URL;
    return path_join(basePath, route);
}

export function path_join(...paths) {
    let normalized = [];
    for (let path of paths) {
        normalized = normalized.concat(path.split('/').filter(Boolean));
    }
    return '/' + normalized.join('/');
}

export function parse_uri_query() {
    const queryParams = new URLSearchParams(window.location.search);
    const params = {};
    for (const [key, value] of queryParams.entries()) {
        params[key] = value;
    }
    return params;
}
