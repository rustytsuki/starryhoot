import { MIMEType } from '../../common/MIMEType';
import { DOCXEditor } from '../../common/office/docx/Editor.jsx';
import { PPTXEditor } from '../../common/office/pptx/Editor.jsx';
import { XLSXEditor } from '../../common/office/xlsx/Editor.jsx';

export function UniEditor({ editor_type, editor_options, onGoBackClick }) {
    const editor = () => {
        if (MIMEType.DOCX === editor_type) {
            return <DOCXEditor options={editor_options} onGoBackClick={onGoBackClick} />;
        } else if (MIMEType.PPTX === editor_type) {
            return <PPTXEditor options={editor_options} onGoBackClick={onGoBackClick} />;
        } else if (MIMEType.XLSX === editor_type) {
            return <XLSXEditor options={editor_options} onGoBackClick={onGoBackClick} />;
        } else {
            return <></>;
        }
    };

    return editor();
}
