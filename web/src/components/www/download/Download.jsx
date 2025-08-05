import { Button } from '../../../shadcn/components/ui/button.tsx';
import { NavigationBar } from '../navi/NavigationBar';
import { get_version, get_download_url } from '../downloader';

export function Download() {
    return (
        <NavigationBar>
            <p className="text-center text-4xl font-semibold mt-4 mb-4">Download StarryHoot Office {get_version()}</p>

            <div className="max-w-[960px] mx-auto px-4 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Windows */}
                    <div className="space-y-4">
                        <p className="text-3xl">Windows</p>
                        <div className="grid grid-cols-12 items-center gap-2">
                            <p className="col-span-2">.exe</p>
                            <div className="col-span-10 space-x-2">
                                <Button size="sm" asChild>
                                    <a href={get_download_url('win32', 'x64')} target="_blank">
                                        X64
                                    </a>
                                </Button>
                                <Button size="sm" asChild>
                                    <a href={get_download_url('win32', 'arm64')} target="_blank">
                                        Arm64
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Linux */}
                    <div className="space-y-4">
                        <p className="text-3xl">Linux</p>
                        <div className="grid grid-cols-12 items-center gap-2">
                            <p className="col-span-2">.deb</p>
                            <div className="col-span-10 space-x-2">
                                <Button size="sm" asChild>
                                    <a href={get_download_url('linux', 'x64', 'deb')} target="_blank">
                                        X64
                                    </a>
                                </Button>
                                <Button size="sm" asChild>
                                    <a href={get_download_url('linux', 'arm64', 'deb')} target="_blank">
                                        Arm64
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 items-center gap-2">
                            <p className="col-span-2">.rpm</p>
                            <div className="col-span-10 space-x-2">
                                <Button size="sm" asChild>
                                    <a href={get_download_url('linux', 'x64', 'rpm')} target="_blank">
                                        X64
                                    </a>
                                </Button>
                                <Button size="sm" asChild>
                                    <a href={get_download_url('linux', 'arm64', 'rpm')} target="_blank">
                                        Arm64
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 items-center gap-2">
                            <p className="col-span-2">.tar.gz</p>
                            <div className="col-span-10 space-x-2">
                                <Button size="sm" asChild>
                                    <a href={get_download_url('linux', 'x64', 'tar.gz')} target="_blank">
                                        X64
                                    </a>
                                </Button>
                                <Button size="sm" asChild>
                                    <a href={get_download_url('linux', 'arm64', 'tar.gz')} target="_blank">
                                        Arm64
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Mac */}
                    <div className="space-y-4">
                        <p className="text-3xl">Mac</p>
                        <div className="grid grid-cols-12 items-center gap-2">
                            <p className="col-span-2">.dmg</p>
                            <div className="col-span-10 space-x-2">
                                <Button size="sm" asChild>
                                    <a href={get_download_url('darwin', 'arm64', 'dmg')} target="_blank">
                                        Apple silicon
                                    </a>
                                </Button>
                                <Button size="sm" asChild>
                                    <a href={get_download_url('darwin', 'x64', 'dmg')} target="_blank">
                                        Intel chip
                                    </a>
                                </Button>
                            </div>
                        </div>
                        <div className="grid grid-cols-12 items-center gap-2">
                            <p className="col-span-2">.zip</p>
                            <div className="col-span-10 space-x-2">
                                <Button size="sm" asChild>
                                    <a href={get_download_url('darwin', 'arm64', 'zip')} target="_blank">
                                        Apple silicon
                                    </a>
                                </Button>
                                <Button size="sm" asChild>
                                    <a href={get_download_url('darwin', 'x64', 'zip')} target="_blank">
                                        Intel chip
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 老版本链接 */}
                <div>
                    <Button variant="link" size="sm" asChild>
                        <a href="https://github.com/rustytsuki/starryhoot/releases" target="_blank">
                            Older Releases
                        </a>
                    </Button>
                </div>
            </div>
        </NavigationBar>
    );
}
