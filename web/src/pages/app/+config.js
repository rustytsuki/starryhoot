const is_app = process.env.VITE_MODE != 'web';

export default {
    filesystemRoutingRoot: is_app ? '/' : '/_do_not_route_here_',
    prerender: is_app,
};
