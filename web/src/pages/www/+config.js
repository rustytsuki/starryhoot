const is_www = 'www' === process.env.VITE_MODE;

export default {
    filesystemRoutingRoot: is_www ? '/' : '/_do_not_route_here_',
    prerender: is_www,
};
