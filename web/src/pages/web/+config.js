const isWeb = 'web' === process.env.VITE_MODE;

export default {
    filesystemRoutingRoot: isWeb ? '/' : '/_do_not_route_here_',
    prerender: isWeb,
};
