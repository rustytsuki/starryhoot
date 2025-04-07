import { BrowserView, dialog } from 'electron/main';
import path from 'path';
import { str_to_base64 } from '../../../web/src/components/common/utils/base64';

const TABSBAR_HEIGHT = 46;
const HOME_VIEW_ID = 'home';

let main_window_ = null;
let tab_views_ = [];
let id_to_view_indexes_ = {};

export function set_main_window(main_window) {
    main_window_ = main_window;

    main_window_.once('ready-to-show', () => {
        update_views_bounds();
    });

    main_window_.on('resize', () => {
        update_views_bounds();
    });
}

export function get_main_window() {
    return main_window_;
}

export function get_current_view() {
    return main_window_.getBrowserView();
}

export function create_home_view() {
    const home_view = new BrowserView({
        webPreferences: {
            preload: path.join(__dirname, '../preload/index.js'),
            sandbox: false,
        },
    });
    const view = make_view_struct(HOME_VIEW_ID, home_view);
    main_window_.setBrowserView(home_view);
    main_window_.setTopBrowserView(home_view);
    home_view.setAutoResize({ width: false, height: false });
    if (process.env.NODE_ENV === 'development') {
        home_view.webContents.loadURL(`http://127.0.0.1:65432`);
    } else {
        home_view.webContents.loadURL(`file:///index.html`);
    }
    set_home_view(view);
}

function make_view_struct(id, view) {
    return { id, view };
}

function update_views_bounds() {
    const [width, height] = main_window_.getContentSize();
    for (let i = 0; i < tab_views_.length; ++i) {
        tab_views_[i].view.setBounds({ x: 0, y: TABSBAR_HEIGHT, width: width, height: height - TABSBAR_HEIGHT });
    }
}

function set_home_view(view) {
    if (tab_views_.length > 0) {
        tab_views_[0] = view;
    } else {
        tab_views_.push(view);
    }
}

export function set_active_index(index, need_notify) {
    const view = tab_views_[index];
    if (view) {
        main_window_.setBrowserView(view.view);
        view.view.webContents.focus();
        if (need_notify) {
            main_window_.webContents.send('active_tab', index);
        }
    }
}

export function close_tab(index) {
    const view = tab_views_[index];
    if (view) {
        delete id_to_view_indexes_[view.id];
        tab_views_.splice(index, 1);
        set_active_index(0, true);
        view.view.webContents.destroy();
    }
}

export function open_file_dialog() {
    const file_path = dialog.showOpenDialogSync({
        filters: [{ name: 'OOXML Files', extensions: ['docx', 'pptx', 'xlsx'] }],
        properties: ['openFile'],
    });
    if (file_path && file_path[0]) {
        open_file(file_path[0]);
    }
}

function open_file(file_path) {
    const index = id_to_view_indexes_[file_path];
    if (index) {
        set_active_index(index, true);
    } else {
        const editor_view = new BrowserView({
            webPreferences: {
                preload: path.join(__dirname, '../preload/editor.js'),
                sandbox: false,
            },
        });
        const [width, height] = main_window_.getContentSize();
        editor_view.setBounds({ x: 0, y: TABSBAR_HEIGHT, width: width, height: height - TABSBAR_HEIGHT });
        editor_view.setAutoResize({ width: false, height: false });

        const file_name = path.basename(file_path);
        const ext = path.extname(file_path).toLowerCase().substring(1);
        editor_view.webContents.loadURL(get_file_uri(ext, file_path));

        // add new tab
        tab_views_.push(make_view_struct(file_path, editor_view));
        const index = tab_views_.length - 1;
        id_to_view_indexes_[file_path] = index;
        main_window_.webContents.send('add_tab', index, file_name);
        set_active_index(index, true);
    }
}

function get_file_uri(file_type, file_path) {
    if ('docx' === file_type || 'pptx' === file_type || 'xlsx' === file_type) {
        const id = str_to_base64(file_path);
        if (process.env.NODE_ENV === 'development') {
            return `http://127.0.0.1:65432/edit/${file_type}?id=${id}`;
        } else {
            return `file:///edit/${file_type}/index.html?id=${id}`;
        }
    }
}
