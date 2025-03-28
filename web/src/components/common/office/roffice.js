let roffice_ = null;

export let load_roffice = async () => {
    if (roffice_) {
        return;
    }

    let pkg = await import('../../../../../deploy/roffice/wasm32-unknown-emscripten/lib/roffice');
    let roffice = await pkg.default();

    await (() => {
        return new Promise((resolve) => {
            roffice.roffice_log_init((level, text) => {
                    
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
