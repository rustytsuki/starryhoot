import { useState, useCallback } from 'react';
import { NavigationBar } from '../navi/NavigationBar';
import { useDropzone } from 'react-dropzone';
import { MIMEType } from '../../common/MimeType';
import { UniEditor } from '../../common/office/UniEditor';

export function TryIt() {
    const [editor_shown, set_editor_shown] = useState(false);
    const [editor_type, set_editor_type] = useState('');
    const [editor_options, set_editor_options] = useState(null);

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length === 0) {
            return;
        }

        const file = acceptedFiles[0];

        if (MIMEType.DOCX === file.type) {
            set_editor_type(MIMEType.DOCX);
        } else if (MIMEType.PPTX === file.type) {
            set_editor_type(MIMEType.PPTX);
        } else if (MIMEType.XLSX === file.type) {
            set_editor_type(MIMEType.XLSX);
        } else {
            set_editor_type('');
            return;
        }

        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        set_editor_shown(true);
        set_editor_options({ file_bytes: bytes, title: file.name });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            [MIMEType.DOCX]: [],
            [MIMEType.PPTX]: [],
            [MIMEType.XLSX]: [],
        },
    });

    const onCloseEditor = () => {
        set_editor_shown(false);
        set_editor_type('');
        set_editor_options(null);
    };

    return (
        <NavigationBar>
            {editor_shown ? (
                <UniEditor editor_type={editor_type} editor_options={editor_options} onGoBackClick={onCloseEditor} />
            ) : (
                <div className="flex w-full h-full items-center justify-center">
                    <div
                        {...getRootProps()}
                        className="w-1/2 h-1/2 border border-dashed border-gray-400 p-16 flex flex-col items-center justify-center text-center cursor-pointer bg-white hover:bg-gray-50 transition"
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>Please release the file to upload</p>
                        ) : (
                            <>
                                <p>Drag and drop file here, or click to select</p>
                                <p>[*.docx, *.pptx, *.xlsx]</p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </NavigationBar>
    );
}
