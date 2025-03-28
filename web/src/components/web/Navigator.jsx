import styles from './Navigator.module.scss';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useState, useEffect } from 'react';
import { usePageContext } from '../../renderer/usePageContext.jsx';
import { ROUTE } from './ROUTE';
import { goto, redirect, get_current_route } from '../common/utils/route_util';

export function Navigator() {
    const [loaded, setLoaded] = useState(false);
    const [user, setUserName] = useState(null);

    const pageContext = usePageContext();
    const curr_route = get_current_route(pageContext);

    useEffect(() => {
        if (window.session && window.session.user) {
            setUserName({
                id: window.session.user.id,
                name: window.session.user.name,
            });
        }

        setLoaded(true);

        return () => {
            setUserName(null);
        };
    }, []);

    let onSignout = async () => {
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}),
        });

        const content = await response.json();
        if (content['success']) {
            redirect(ROUTE.HOME);
        }
    };

    return (
        <Navbar bg="light" expand="sm" sticky="top" className={styles.root}>
            <Container>
                <Navbar.Brand>StarryHoot🦉</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link
                            active={curr_route === ROUTE.HOME}
                            onClick={() => {
                                goto(ROUTE.HOME);
                            }}
                        >
                            Home
                        </Nav.Link>
                        {loaded && user && (
                            <Nav.Link
                                active={curr_route === ROUTE.DRIVE}
                                onClick={() => {
                                    goto(ROUTE.DRIVE);
                                }}
                            >
                                My Files
                            </Nav.Link>
                        )}
                        <Nav.Link
                            active={curr_route === ROUTE.ABOUT}
                            onClick={() => {
                                goto(ROUTE.ABOUT);
                            }}
                        >
                            About
                        </Nav.Link>
                    </Nav>
                    {loaded && !user && (
                        <Form className="d-flex">
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => {
                                    goto(ROUTE.SIGN_IN);
                                }}
                            >
                                Sign In
                            </Button>
                            <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => {
                                    goto(ROUTE.SIGN_UP);
                                }}
                            >
                                Sign Up
                            </Button>
                        </Form>
                    )}
                    {loaded && user && (
                        <Form className="d-flex">
                            <DropdownButton variant="outline-success" size="sm" title={user.name} menualign="right">
                                <Dropdown.Item size="sm" onClick={onSignout}>Sign out</Dropdown.Item>
                            </DropdownButton>
                        </Form>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
