export class OfficeEditor {
    constructor(fid) {
        this.fid_ = fid;
        this.destroyed_ = false;

        this.canvas_dom_ = null;
        this.viewport_dom_ = null;
        this.area_dom_ = null;
    }

    async load() {
        throw '';
    }

    unload() {
        throw '';
    }

    update() {
        throw '';
    }

    async fetch_title() {
        throw '';
    }

    set_viewport_dom(canvas_dom, viewport_dom, area_dom) {
        this.canvas_dom_ = canvas_dom;
        this.viewport_dom_ = viewport_dom;
        this.area_dom_ = area_dom;

        if (this.canvas_dom_) {
            this.on_resize();
        }
    }

    is_dom_ready() {
        return this.canvas_dom_ && this.viewport_dom_ && this.area_dom_;
    }

    init() {
        this.load()
            .then(() => {
                if (this.destroyed_) {
                    this.set_viewport_dom();
                    this.unload();
                    return;
                }

                console.log('office editor init.');

                // first update
                this.on_resize();
            })
            .catch((e) => {
                console.error(e);
            });
    }

    destroy() {
        this.destroyed_ = true;
        console.log('docx editor destroy.');
        this.set_viewport_dom();
        this.unload();
    }

    on_resize = () => {
        if (!this.is_dom_ready()) {
            return;
        }

        const w = this.viewport_dom_['clientWidth'];
        const h = this.viewport_dom_['clientHeight'];

        this.canvas_dom_['style']['width'] = `${w}px`;
        this.canvas_dom_['style']['height'] = `${h}px`;
        this.canvas_dom_['width'] = Math.round(this.canvas_dom_['clientWidth'] * window.devicePixelRatio);
        this.canvas_dom_['height'] = Math.round(this.canvas_dom_['clientHeight'] * window.devicePixelRatio);

        // console.log(`resize canvas to (${this.canvas_dom_.width}, ${this.canvas_dom_.height})`);

        let ctx = this.canvas_dom_.getContext('2d');
        ctx['imageSmoothingEnabled'] = false;

        this.update();
    };

    on_scroll = (e) => {
        const x = e.currentTarget.scrollLeft;
        const y = e.currentTarget.scrollTop;

        // console.log(`viewport scroll to (${x}, ${y})`);

        this.update();
    };

    // The *Down happens first, the *Press happens second (when text is entered), and the *Up happens last (when text input is complete)
    on_keydown = (e) => {
    };
}
