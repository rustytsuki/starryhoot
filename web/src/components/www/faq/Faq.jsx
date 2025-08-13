import { NavigationBar } from '../navi/NavigationBar';
import file_url from './Faq.docx';
import { DOCXEditor } from '../../common/office/docx/Editor.jsx';
import { go_back } from '../../common/utils/route_util.js';

export function Faq() {
    return (
        <NavigationBar>
            <DOCXEditor options={{ file_url: file_url, title: 'FAQ' }} onGoBackClick={go_back} />
        </NavigationBar>
    );
}
