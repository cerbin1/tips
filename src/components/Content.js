import React from "react";
import advicesLogo from "../resources/advices.jpg"
import {Container, Image, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import AdviceContent from "./AdviceContent";
import PopularAdvices from "./PopularAdvices";

const Content = () => {
    return (
        <Container>
            <Row>
                <Col sm={"auto"}>
                    <Image className={"img-fluid"} src={advicesLogo} fluid/>
                </Col>
            </Row>
            <Row>
                <Col sm={9}>
                    <AdviceContent/>
                </Col>
                <Col sm={"auto"}>
                    <PopularAdvices/>
                </Col>
            </Row>
        </Container>
    )
};

export default Content;
