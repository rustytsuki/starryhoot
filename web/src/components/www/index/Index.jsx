import { useEffect, useState } from 'react';
import { Button } from '../../../shadcn/components/ui/button.tsx';
import { NavigationBar } from '../navi/NavigationBar';
import { auto_download, get_download_button_name } from '../downloader';
import { ROUTE } from '../ROUTE';
import { goto } from '../../common/utils/route_util';

export function Index() {
    const [download_bt_name_, set_download_bt_name] = useState('Download');

    useEffect(() => {
        const name = get_download_button_name();
        set_download_bt_name(name);
        return () => {};
    }, []);

    return (
        <NavigationBar>
            <p className="text-center text-5xl font-semibold mt-4 mb-4">StarryHoot Office</p>
            <Button
                size="lg"
                className="block mx-auto"
                onClick={() => {
                    auto_download();
                }}
            >
                {download_bt_name_}
            </Button>
            <Button
                variant="link"
                size="sm"
                className="block mx-auto"
                onClick={() => {
                    goto(ROUTE.DOWNLOAD);
                }}
            >
                other platforms
            </Button>
        </NavigationBar>
    );
}
