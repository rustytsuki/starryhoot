let roffice_ = null;

export let load_roffice = async () => {
    if (roffice_) {
        return;
    }

    let roffice;
    // #v-ifdef VITE_STARRYHOOT_WEB||VITE_STARRYHOOT_SITE
    let pkg = await import('../../../../../deploy/roffice/wasm32-unknown-emscripten/lib/roffice');
    roffice = await pkg.default();
    console.log('load kernel(wasm).');
    // #v-elif VITE_STARRYHOOT_ELECTRON
    roffice = starryhoot.roffice;
    console.log('load kernel(node).');
    // #v-endif

    await (() => {
        return new Promise((resolve) => {
            roffice.roffice_log_init((level, text) => {
                // console.log(text);
            });

            roffice.roffice_init((data) => {
                resolve(data);
            });
        });
    })();

    roffice_ = roffice;
};

export function get_roffice() {
    return roffice_;
}
