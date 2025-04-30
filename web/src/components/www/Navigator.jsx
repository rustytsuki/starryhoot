import styles from './Navigator.module.scss';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { ROUTE } from './ROUTE';
import { goto } from '../common/utils/route_util';

export function Navigator() {
    return (
        <Navbar bg="light" expand="sm" sticky="top" className={styles.root}>
            <Container>
                <Navbar.Brand>
                    <Nav.Link
                        onClick={() => {
                            goto(ROUTE.INDEX);
                        }}
                    >
                        StarryHoot🦉
                    </Nav.Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            onClick={() => {
                                goto(ROUTE.FAQ);
                            }}
                        >
                            FAQ
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => {
                                window.open('https://github.com/rustytsuki/starryhoot', '_blank');
                            }}
                        >
                            Github
                        </Nav.Link>
                    </Nav>
                    <Button
                        onClick={() => {
                            goto(ROUTE.DOWNLOAD);
                        }}
                    >
                        Download
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
