import { Button } from "../../../shadcn/components/ui/button";
import { goto } from '../utils/route_util';

export function EditorQuitButton({onGoBackClick}) {
    return (
        <Button
            variant="link"
            onClick={() => {
                // #v-ifdef VITE_STARRYHOOT_WEB
                goto('/drive');
                // #v-elif VITE_STARRYHOOT_WWW
                onGoBackClick();
                // #v-elif VITE_STARRYHOOT_ELECTRON
                starryhoot.goto_home_tab();
                // #v-endif
            }}
        >
            {
                // #v-ifdef VITE_STARRYHOOT_WEB
                'My Files'
                // #v-elif VITE_STARRYHOOT_WWW
                "Go Back"
                // #v-elif VITE_STARRYHOOT_ELECTRON
                "Home"
                // #v-endif
            }
        </Button>
    );
}
