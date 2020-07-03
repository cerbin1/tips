import React, {Component} from "react";
import AdviceService from '../service/advice-service';
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Logo from "./Logo";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";
import {Alert} from "react-bootstrap";

export class Ranking extends Component {


    constructor(props, context) {
        super(props, context);

        this.state = {
            topAdvices: null,
        }
    }

    componentDidMount() {
        this.setState({topAdvices: AdviceService.getTop10Advices()});
    }

    render() {
        let ranking;
        if (this.state.topAdvices === null) {
            ranking =
                <Row className={"d-flex justify-content-center"}>
                    <Alert variant={"warning"}>Nie znaleziono żadnych porad</Alert>
                </Row>
        } else {
            ranking =
                <div>
                    <Row>
                        <h1>Top 10 porad</h1>
                    </Row>
                    <Row>
                        <Table striped bordered hover variant="dark">
                            <thead>
                            <tr>
                                <th>Nazwa</th>
                                <th>Ocena</th>
                                <th>Nawigacja</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.topAdvices.map(advice => {
                                return (
                                    <tr key={advice.id}>
                                        <td>{advice.name}</td>
                                        <td>{advice.ranking}</td>
                                        <td>
                                            <Link className="btn btn-outline-success" to={{
                                                pathname: '/advices/' + advice.id
                                            }}>Wyświetl szczegóły</Link>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </Table>
                    </Row>
                </div>
        }

        return (
            <Container>
                <Row>
                    <Col>
                        <Logo/>
                    </Col>
                </Row>
                {ranking}
            </Container>
        )
    }
}