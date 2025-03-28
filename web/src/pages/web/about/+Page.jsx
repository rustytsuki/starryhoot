import './code.css';
import Button from 'react-bootstrap/Button';
import { ROUTE } from '../../../components/web/ROUTE';
import { goto } from '../../../components/common/utils/route_util';
import { Navigator } from '../../../components/web/Navigator';
import { About } from '../../../components/common/About';

export { Page };

function Page() {
    function goHome() {
        goto(ROUTE.HOME);
    }

    function goSelf() {
        goto(ROUTE.ABOUT);
    }

    return (
        <>
            <Navigator/>
            <About/>
            <Button onClick={goHome}>Home</Button>
            <Button onClick={goSelf}>Self</Button>
        </>
    );
}
