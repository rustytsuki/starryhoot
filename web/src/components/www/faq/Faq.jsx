import { NavigationBar } from '../navi/NavigationBar';
import FaqPPTXUrl from './Faq.pptx';
import { PPTXEditor } from '../../common/office/pptx/Editor.jsx';

export function Faq() {
    return (
        <NavigationBar>
            <PPTXEditor options={{ file_url: FaqPPTXUrl, title: 'FAQ' }} />
        </NavigationBar>
    );
}
