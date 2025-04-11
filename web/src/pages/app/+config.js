const is_app = 'electron' === process.env.VITE_MODE;

export default {
    filesystemRoutingRoot: is_app ? '/' : '/_do_not_route_here_',
    prerender: is_app,
};
