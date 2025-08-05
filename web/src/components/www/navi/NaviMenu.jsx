import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '../../../shadcn/components/ui/navigation-menu.tsx';
import { Button } from '../../../shadcn/components/ui/button.tsx';
import { ROUTE } from '../ROUTE.js';
import { goto } from '../../common/utils/route_util';
export const NavMenu = (props) => {
    return (
        <NavigationMenu {...props}>
            <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="focus:bg-transparent active:bg-transparent">
                        <Button
                            variant="link"
                            onClick={() => {
                                goto(ROUTE.FAQ);
                            }}
                        >
                            FAQ
                        </Button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="focus:bg-transparent active:bg-transparent">
                        <Button
                            variant="link"
                            onClick={() => {
                                window.open('https://github.com/rustytsuki/starryhoot', '_blank');
                            }}
                        >
                            Github
                        </Button>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    );
};
