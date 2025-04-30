import styles from './Download.module.scss';
import { Navigator } from '../Navigator';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { get_version, get_download_url } from '../downloader';

export function Download() {
    return (
        <>
            <Navigator />

            <h1 className={styles.title}>Download StarryHoot Office {get_version()}</h1>

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
                                <Button size="sm" href={get_download_url('win32', 'x64')} target="_blank">
                                    X64
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('win32', 'arm64')} target="_blank">
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
                                <Button size="sm" href={get_download_url('linux', 'x64', 'deb')} target="_blank">
                                    X64
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('linux', 'arm64', 'deb')} target="_blank">
                                    Arm64
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <p>.rpm</p>
                            </Col>
                            <Col sm={10}>
                                <Button size="sm" href={get_download_url('linux', 'x64', 'rpm')} target="_blank">
                                    X64
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('linux', 'arm64', 'rpm')} target="_blank">
                                    Arm64
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <p>.tar.gz</p>
                            </Col>
                            <Col sm={10}>
                                <Button size="sm" href={get_download_url('linux', 'x64', 'tar.gz')} target="_blank">
                                    X64
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('linux', 'arm64', 'tar.gz')} target="_blank">
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
                                <Button size="sm" href={get_download_url('darwin', 'arm64', 'dmg')} target="_blank">
                                    Apple silicon
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('darwin', 'x64', 'dmg')} target="_blank">
                                    Intel chip
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={2}>
                                <p>.zip</p>
                            </Col>
                            <Col sm={10}>
                                <Button size="sm" href={get_download_url('darwin', 'arm64', 'zip')} target="_blank">
                                    Apple silicon
                                </Button>
                                <span> </span>
                                <Button size="sm" href={get_download_url('darwin', 'x64', 'zip')} target="_blank">
                                    Intel chip
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <Button variant="link" size="sm" href="https://github.com/rustytsuki/starryhoot/releases" target="_blank">
                        Older Releases
                    </Button>
                    </Col>
                </Row>
            </Container>
        </>
    );
}
