import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { useState, createRef } from 'react';
import { ROUTE } from '../ROUTE.js';
import { redirect, get_full_path } from '../../common/utils/route_util.js';
import { MessageBox } from '../../common/utils/MessageBox.jsx';

export function SignIn() {
    const [validated, setValidated] = useState(false);
    const formUser = createRef();
    const formPassword = createRef();
    const messageBox = createRef();

    let onSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const form = event.currentTarget;
        if (form.checkValidity()) {
            // post signin
            const user = formUser.current.value;
            const password = formPassword.current.value;

            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 'name': user.trim(), 'password': password.trim() }),
            });

            const content = await response.json();
            if (content['success']) {
                redirect(ROUTE.HOME);
            } else {
                messageBox.current.show('', 'Sign in error!', false);
            }
        }

        setValidated(true);
    };

    return (
        <>
            <Container>
                <Row>
                    <Col></Col>
                    <Col xs={6}>
                        <br />
                        <h2 style={{ 'textAlign': 'center' }}>Sign in to StarryHoot🦉</h2>
                        <br />
                        <Card>
                            <Card.Body>
                                <Form noValidate validated={validated} onSubmit={onSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control
                                            ref={formUser}
                                            type="text"
                                            required
                                            placeholder="Enter Username"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control
                                            ref={formPassword}
                                            type="password"
                                            required
                                            placeholder="Enter Password"
                                        />
                                    </Form.Group>
                                    <Button variant="outline-primary" type="submit">
                                        Sign in
                                    </Button>
                                </Form>
                            </Card.Body>
                        </Card>
                        <br />
                        <Card>
                            <Card.Body>
                                <Form.Label>New to StarryHoot🦉?</Form.Label>
                                <span>{'\u00A0'}</span>
                                <a href={get_full_path(ROUTE.SIGN_UP)}>Create an account.</a>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col></Col>
                </Row>
            </Container>

            <MessageBox ref={messageBox} />
        </>
    );
}
