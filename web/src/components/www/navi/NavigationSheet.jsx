import { Button } from '../../../shadcn/components/ui/button.tsx';
import { Sheet, SheetContent, SheetTrigger } from '../../../shadcn/components/ui/sheet.tsx';
import { Menu } from 'lucide-react';
import { Logo } from './Logo.jsx';
import { NavMenu } from './NaviMenu.jsx';
export const NavigationSheet = () => {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                    <Menu />
                </Button>
            </SheetTrigger>
            <SheetContent>
                <Logo />
                <NavMenu orientation="vertical" className="mt-12" />
            </SheetContent>
        </Sheet>
    );
};
