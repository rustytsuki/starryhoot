import { BrowserView } from 'electron/main';
import path from 'path';

const TABSBAR_HEIGHT = 46;

let main_window_ = null;
let tab_views_ = [];

export function set_main_window(main_window) {
    main_window_ = main_window;
}

export function create_home_view() {
    const home_view = new BrowserView({
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            sandbox: false,
        },
    });
    main_window_.setBrowserView(home_view);
    main_window_.setTopBrowserView(home_view);
    main_window_.once('ready-to-show', () => {
        const [width, height] = main_window_.getContentSize();
        home_view.setBounds({ x: 0, y: TABSBAR_HEIGHT, width: width, height: height - TABSBAR_HEIGHT });
    });
    home_view.setAutoResize({ width: true, height: true });
    home_view.webContents.loadURL('http://127.0.0.1:65432');
    set_home_view(home_view);
}

function set_home_view(home_view) {
    if (tab_views_.length > 0) {
        tab_views_[0] = home_view;
    } else {
        tab_views_.push(home_view);
    }
}

export function open_file(file_path) {
}