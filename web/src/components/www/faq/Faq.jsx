import { NavigationBar } from '../navi/NavigationBar';
import FaqPPTXUrl from './Faq.pptx';
import { PPTXEditor } from '../../common/office/pptx/Editor.jsx';
import { go_back } from '../../common/utils/route_util.js';

export function Faq() {
    return (
        <NavigationBar>
            <PPTXEditor options={{ file_url: FaqPPTXUrl, title: 'FAQ' }} onGoBackClick={go_back} />
        </NavigationBar>
    );
}
