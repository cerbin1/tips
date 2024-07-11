import React from "react";
import AdviceService from '../service/advice-service';
import { Button, Container, Row } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Logo from "./Logo";

class AdviceDetails extends React.Component {
    adviceId;

    constructor(props) {
        super(props);

        let adviceId = props.match.params.adviceId;
        let adviceDetails = AdviceService.getAdviceDetailsById(adviceId);

        this.state = {
            name: adviceDetails.name,
            content: adviceDetails.content,
            ranking: adviceDetails.ranking,
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Logo />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <h2>
                            {this.state.name}
                        </h2>
                    </Col>
                </Row>
                <Row>
                    <Col>

                        {this.state.content}
                    </Col>
                </Row>
                <hr />
                <Row>
                    <Col sm={"6"}>
                        Ocena przydatności: {this.state.ranking}
                    </Col>
                    <Col sm={"Auto"} className={"float-right"}>
                        <Button variant={"success"} className="float-left"
                            onClick={() => this.setState({ ranking: this.state.ranking + 1 })}>Przydatne</Button>
                    </Col>
                </Row>

                <Row>
                    <Button variant="warning" onClick={() => {
                        this.props.history.goBack()
                    }}>
                        Cofnij
                    </Button>
                </Row>
            </Container>
        )
    }
}

export default AdviceDetails;
