// #v-ifdef VITE_STARRYHOOT_WEB
import { OfficeEditorWeb as OfficeEditorClass } from '../editor/OfficeEditorWeb';
// #v-elif VITE_STARRYHOOT_WWW
import { OfficeEditorWWW as OfficeEditorClass } from '../editor/OfficeEditorWWW';
// #v-elif VITE_STARRYHOOT_ELECTRON
import { OfficeEditorElectron as OfficeEditorClass } from '../editor/OfficeEditorElectron';
// #v-endif

export { OfficeEditorClass };
