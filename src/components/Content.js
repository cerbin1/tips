import React from "react";
import tipImage from "../resources/tips.jpg"
import {Container, Image, Row} from "react-bootstrap";
import Col from "react-bootstrap/Col";
import TipContent from "./TipContent";
import PopularTips from "./PopularTips";

const Content = () => {
    return (
        <Container>
            <Row>
                <Col sm={"auto"}>
                    <Image className={"img-fluid"} src={tipImage} fluid/>
                </Col>
            </Row>
            <Row className={"text-center"}>
                <Col sm={9}>
                    <TipContent/>
                </Col>
                <Col sm={"auto"}>
                    <PopularTips/>
                </Col>
            </Row>
        </Container>
    )
};

export default Content;
