const is_site = 'site' === process.env.VITE_MODE;

export default {
    filesystemRoutingRoot: is_site ? '/' : '/_do_not_route_here_',
    prerender: is_site,
};
