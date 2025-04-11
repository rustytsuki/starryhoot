let roffice_ = null;

export let load_roffice = async () => {
    if (roffice_) {
        return;
    }

    // #v-ifdef VITE_STARRYHOOT_WEB||VITE_STARRYHOOT_SITE
    let pkg = await import('../../../../../deploy/roffice/wasm32-unknown-emscripten/lib/roffice');
    let roffice = await pkg.default();
    // #v-elif VITE_STARRYHOOT_ELECTRON
    let roffice = starryhoot.roffice;
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
