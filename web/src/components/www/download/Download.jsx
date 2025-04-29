import styles from './Download.module.scss';
import { Navigator } from '../Navigator';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';
import { get_download_url } from '../downloader';

function open_release() {
    window.open('https://github.com/rustytsuki/starryhoot/releases', '_blank');
}

export function Download() {
    useEffect(() => {
        return () => {};
    }, []);

    return (
        <>
            <Navigator />

            <h1 className={styles.title}>Download StarryHoot</h1>

            <Container style={{ width: '960px' }}>
                <Row>
                    <Col sm={4}>
                        <h2>Windows</h2>
                    </Col>
                    <Col sm={4}>
                        <h2>Linux</h2>
                    </Col>
                    <Col sm={4}>
                        <h2>Mac</h2>
                    </Col>
                </Row>
                <Row>
                    <Col sm={4}>
                        <Row>
                            <Col sm={2}>
                                <p>.exe </p>
                            </Col>
                            <Col sm={10}>
                                <Button size="sm" href={get_download_url('win32', 'x64')}>
                                    X64
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('win32', 'arm64')}>
                                    Arm64
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={4}>
                        <Row>
                            <Col sm={2}>
                                <p>.deb</p>
                            </Col>
                            <Col sm={10}>
                                <Button size="sm" href={get_download_url('linux', 'x64', 'deb')}>
                                    X64
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('linux', 'arm64', 'deb')}>
                                    Arm64
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <p>.rpm</p>
                            </Col>
                            <Col sm={10}>
                                <Button size="sm" href={get_download_url('linux', 'x64', 'rpm')}>
                                    X64
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('linux', 'arm64', 'rpm')}>
                                    Arm64
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <p>.tar.gz</p>
                            </Col>
                            <Col sm={10}>
                                <Button size="sm" href={get_download_url('linux', 'x64', 'tar.gz')}>
                                    X64
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('linux', 'arm64', 'tar.gz')}>
                                    Arm64
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col sm={4}>
                        <Row>
                            <Col sm={2}>
                                <p>.dmg</p>
                            </Col>
                            <Col sm={10}>
                                <Button size="sm" href={get_download_url('darwin', 'arm64', 'dmg')}>
                                    Apple silicon
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('darwin', 'x64', 'dmg')}>
                                    Intel chip
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <p>.zip</p>
                            </Col>
                            <Col sm={10}>
                                <Button size="sm" href={get_download_url('darwin', 'arm64', 'zip')}>
                                    Apple silicon
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('darwin', 'x64', 'zip')}>
                                    Intel chip
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
