import React from "react";

import AdviceService from '../service/advice-service';
import { Button, Container } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Logo from "./Logo";
import PopularAdvices from "./PopularAdvices";
import Table from "react-bootstrap/Table";
import { Link } from "react-router-dom";

class AdviceCategory extends React.Component {
    categoryId;

    constructor(props, context) {
        super(props, context);

        this.state = {
            advicesByCategory: null
        }
    }

    componentDidMount() {
        let advicesByCategory = AdviceService.getAdvicesByCategory(this.props.match.params.categoryId);
        this.setState({ advicesByCategory: advicesByCategory })
    }

    render() {
        let advicesByCategory = this.state.advicesByCategory;
        let advicesContent = null;
        if (advicesByCategory !== null) {
            if (advicesByCategory.advices.length === 0) {
                advicesContent = <div>
                    <p>Brak porad z tej kategorii</p>
                    <Button variant="warning" onClick={() => {
                        this.props.history.goBack()
                    }}>
                        Cofnij do listy kategorii
                    </Button>
                </div>
            } else {
                advicesContent =
                    <div>
                        <h1>{advicesByCategory.name}</h1>
                        <Table striped bordered hover variant="dark">
                            <thead>
                                <tr>
                                    <th>Nazwa porady</th>
                                    <th>Ocena</th>
                                    <th>Nawigacja</th>
                                </tr>
                            </thead>
                            <tbody>
                                {advicesByCategory.advices.map(advice => {
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
                        <Button variant="warning" onClick={() => {
                            this.props.history.goBack()
                        }}>
                            Cofnij do listy kategorii
                        </Button>
                    </div>
            }
        }

        return (
            <Container>
                <Row>
                    <Col>
                        <Logo />
                    </Col>
                </Row>
                <Row>
                    <Col sm={9}>
                        {advicesContent}
                    </Col>

                    <Col sm={"auto"}>
                        <PopularAdvices />
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default AdviceCategory;
