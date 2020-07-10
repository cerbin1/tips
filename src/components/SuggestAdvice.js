import React, {Component} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Logo from "./Logo";
import Form from "react-bootstrap/Form";
import AdviceService from "../service/advice-service";
import Button from "react-bootstrap/Button";

export default class SuggestAdvice extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            categories: AdviceService.getAllCategories()
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Logo/>
                    </Col>
                </Row>
                <Row>
                    <h1>Zaproponuj poradę</h1>
                </Row>
                <Form>
                    <Form.Group>
                        <Form.Label>
                            Nazwa porady
                        </Form.Label>
                        <Form.Control placeholder="Nazwa"/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Kategoria
                        </Form.Label>
                        <Form.Control as="select">
                            {this.state.categories.map(category => {
                                    return (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    )
                                }
                            )}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Treść
                        </Form.Label>
                        <Form.Control as="textarea" rows="10"/>
                    </Form.Group>

                    <Button variant="success" onClick={() => alert("Wysłano")}>
                        Wyślij propozycję
                    </Button>
                </Form>
            </Container>
        )
    }
}
