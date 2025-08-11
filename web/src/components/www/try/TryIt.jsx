import { NavigationBar } from '../navi/NavigationBar';

export function TryIt() {
    return (
        <NavigationBar>
            <div className="flex w-full h-full items-center justify-center">
                <div className="w-1/2 h-1/2 bg-gray-200"></div>
            </div>
        </NavigationBar>
    );
}
