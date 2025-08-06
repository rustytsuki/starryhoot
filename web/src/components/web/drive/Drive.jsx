import { useState, useEffect, createRef, useCallback } from 'react';
import { Button } from '../../../shadcn/components/ui/button.js';
import { Label } from '../../../shadcn/components/ui/label.tsx';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../shadcn/components/ui/table.tsx';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '../../../shadcn/components/ui/dialog.tsx';
import { useDropzone } from 'react-dropzone';
import { usePageContext } from '../../../renderer/usePageContext.jsx';
import { MessageBox } from '../../common/utils/MessageBox.jsx';
import { NavigationBar } from '../navi/NavigationBar.jsx';
import { goto } from '../../common/utils/route_util.js';
import { getFileNameFromPath } from '../../common/utils/path_util.js';

export function Drive() {
    const [open, setOpen] = useState(false);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('idle'); // idle | success | error
    const [filelist, set_file_list] = useState([]);

    const messageBox = createRef();

    let loadFiles = async () => {
        const response = await fetch(`/api/drive/files`);
        const content = await response.json();
        if (content['success']) {
            let files = content['payload'];
            return files;
        } else {
            return [];
        }
    };

    useEffect(() => {
        let is_mounted = true;
        (async () => {
            if (is_mounted) {
                try {
                    let files = await loadFiles();
                    set_file_list([...files]);
                    console.log('file number:', files.length);
                    console.log(JSON.stringify(files));
                } catch (e) {
                    console.log(e.message);
                }
            }
        })();

        return () => {
            is_mounted = false;
        };
    }, []);

    const onDrop = useCallback(async (acceptedFiles) => {
        setUploadedFiles(acceptedFiles);

        if (acceptedFiles.length === 0) {
            return;
        }

        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        // acceptedFiles.forEach((file) => {
        //     formData.append('files', file);
        // });

        try {
            setUploading(true);
            setUploadStatus('idle');

            const response = await fetch('/api/drive/upload', {
                method: 'post',
                body: formData,
            });
            const content = await response.json();
            if (content['success']) {
                setUploadStatus('success');
                console.log('Upload success');
                let file = content['payload'];
                set_file_list([file, ...filelist]);
            } else {
                setUploadStatus('error');
                console.error('Upload failed', await res.text());
            }

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
        } catch (err) {
            setUploadStatus('error');
            console.error('Upload error', err);
        } finally {
            setUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
            'application/vnd.openxmlformats-officedocument.presentationml.presentation': [],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
        },
    });

    return (
        <NavigationBar>
            <div className="grid min-w-xl max-w-5xl mx-auto">
                <div className="flex gap-2 mt-4 mb-4">
                    <Label>My Documents</Label>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline">Upload</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Upload</DialogTitle>
                            </DialogHeader>

                            <div
                                {...getRootProps()}
                                className="border border-dashed border-gray-400 p-6 rounded-md text-center cursor-pointer hover:bg-gray-50 transition"
                            >
                                <input {...getInputProps()} />
                                {isDragActive ? (
                                    <p>Please release the file to upload</p>
                                ) : (
                                    <p>Drag and drop files here, or click to select</p>
                                )}
                            </div>

                            {uploadedFiles.length > 0 && (
                                <ul className="mt-4 space-y-2 text-sm text-left">
                                    {uploadedFiles.map((file, index) => (
                                        <li key={index} className="truncate">
                                            ✅ {file.name}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            {uploading && <p className="text-blue-500 mt-4">uploading...</p>}
                            {uploadStatus === 'success' && <p className="text-green-600 mt-4">✅ Upload successful!</p>}
                            {uploadStatus === 'error' && <p className="text-red-500 mt-4">❌ Upload failed!</p>}
                        </DialogContent>
                    </Dialog>
                </div>
                <Table className="border rounded">
                    <TableHeader>
                        <TableRow className="[&>*]:whitespace-nowrap bg-background">
                            <TableHead className="bg-background w-[40px]">ID</TableHead>
                            <TableHead className="bg-background">Name</TableHead>
                            <TableHead className="bg-background">Time</TableHead>
                            <TableHead className="bg-background w-[100px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="overflow-hidden">
                        {filelist.map((file) => (
                            <TableRow key={file.id} className="[&>*]:whitespace-nowrap hover:bg-blue-50">
                                <TableCell className="pl-4">{file.id}</TableCell>
                                <TableCell>{file.title}</TableCell>
                                <TableCell>{new Date(file.mtime * 1000).toLocaleString()}</TableCell>
                                <TableCell className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            console.log('open file: ', file.id);
                                        }}
                                    >
                                        Open
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        Delete
                                    </Button>
                                    <Button size="sm" variant="outline">
                                        Open Native Folder
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <MessageBox ref={messageBox} />
        </NavigationBar>
    );
}
