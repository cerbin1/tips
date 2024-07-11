import React from "react";
import { Container, Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import AdviceContent from "./AdviceContent";
import PopularAdvices from "./PopularAdvices";
import Logo from "./Logo";

const Content = () => {
    return (
        <Container>
            <Row>
                <Col sm={"auto"}>
                    <Logo />
                </Col>
            </Row>
            <Row>
                <Col sm={9}>
                    <AdviceContent />
                </Col>
                <Col sm={"auto"}>
                    <PopularAdvices />
                </Col>
            </Row>
        </Container>
    )
};

export default Content;
