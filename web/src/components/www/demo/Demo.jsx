import { Button } from '../../../shadcn/components/ui/button';
import { goto } from '../../common/utils/route_util';
import { str_to_base64 } from '../../common/utils/base64';
import { NavigationBar } from '../navi/NavigationBar';
import simple_text_docx from '../file/files/simple text.docx';
import all_presets_shapes_pptx from '../file/files/all presets shapes.pptx';
import multi_sheet_xlsx from '../file/files/multi sheet.xlsx';

export function Demo() {
    const files = [
        {
            title: 'simple text.docx',
            url: simple_text_docx,
        },
        {
            title: 'all presets shapes.pptx',
            url: all_presets_shapes_pptx,
        },
        {
            title: 'multi sheet.xlsx',
            url: multi_sheet_xlsx,
        },
    ];

    return (
        <NavigationBar>
            <div className="w-1/2 mx-auto flex flex-col">
                {files.map((file, index) => (
                    <Button
                        key={index}
                        variant="link"
                        onClick={() => {
                            goto(`/file?payload=${str_to_base64(JSON.stringify(file))}`);
                        }}
                    >
                        {file.title}
                    </Button>
                ))}
            </div>
        </NavigationBar>
    );
}
