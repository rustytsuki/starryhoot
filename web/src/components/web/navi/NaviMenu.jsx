import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from '../../../shadcn/components/ui/navigation-menu.tsx';
import { Button } from '../../../shadcn/components/ui/button.tsx';
import { cn } from '../../../shadcn/lib/utils';
import { usePageContext } from '../../../renderer/usePageContext.jsx';
import { ROUTE } from '../ROUTE.js';
import { goto, redirect, get_current_route } from '../../common/utils/route_util';
export const NavMenu = (props) => {
    let menu_items = [];

    menu_items.push({
        title: 'Home',
        route: ROUTE.HOME,
    });
    if (props.loaded && props.user) {
        menu_items.push({
            title: 'My Files',
            route: ROUTE.DRIVE,
        });
    }
    menu_items.push({
        title: 'About',
        route: ROUTE.ABOUT,
    });

    const pageContext = usePageContext();
    const curr_route = get_current_route(pageContext);

    return (
        <NavigationMenu {...props}>
            <NavigationMenuList className="gap-6 space-x-0 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-start">
                {menu_items.map((item, index) => (
                    <NavigationMenuItem key={index}>
                        <NavigationMenuLink
                            asChild
                            className={cn(
                                'focus:bg-transparent active:bg-transparent',
                                curr_route === item.route ? 'underline' : ''
                            )}
                        >
                            <Button
                                variant="link"
                                onClick={() => {
                                    goto(item.route);
                                }}
                            >
                                {item.title}
                            </Button>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
};
