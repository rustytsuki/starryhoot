import { Button } from '../../../shadcn/components/ui/button.js';
import { ROUTE } from '../ROUTE.js';
import { goto } from '../../common/utils/route_util';

export const Logo = () => (
    <Button
        variant="link"
        size="lg"
        className="text-lg"
        onClick={() => {
            goto(ROUTE.INDEX);
        }}
    >
        StarryHoot🦉
    </Button>
);
