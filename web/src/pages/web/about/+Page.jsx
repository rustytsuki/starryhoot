import './code.css';
import { NavigationBar } from '../../../components/web/navi/NavigationBar.jsx';
import { About } from '../../../components/common/About';

export { Page };

function Page() {
    return (
        <NavigationBar>
            <About />
        </NavigationBar>
    );
}
