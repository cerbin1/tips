import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Logo from "./Logo";
import Form from "react-bootstrap/Form";
import AdviceService from "../service/advice-service";
import Button from "react-bootstrap/Button";
import ReCAPTCHA from "react-google-recaptcha";

export default class SuggestAdvice extends Component {


    constructor(props, context) {
        super(props, context);
        this.state = {
            categories: AdviceService.getAllCategories(),
            name: undefined,
            category: undefined,
            content: undefined
        }
    }

    onChangeCaptcha = (value) => {
        console.log("Captcha value:", value);
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
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
                    <h1>Zaproponuj poradę</h1>
                </Row>
                <Form>
                    <Form.Group>
                        <Form.Label>
                            Nazwa porady
                        </Form.Label>
                        <Form.Control
                            name="name"
                            onChange={(e) => this.handleChange(e)}
                            placeholder="Nazwa" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>
                            Kategoria
                        </Form.Label>
                        <Form.Control
                            name="category"
                            value={this.state.categories[1]}
                            onChange={(e) => this.handleChange(e)}
                            as="select">
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
                        <Form.Control name="content" onChange={(e) => this.handleChange(e)} as="textarea" rows="10" />
                    </Form.Group>


                    <ReCAPTCHA
                        sitekey="6LfUyU8pAAAAAILsMrKnhxOO8G-yhmy7zRIE--R0"
                        onChange={this.onChangeCaptcha}
                    />

                    <Button variant="success" onClick={() => {
                        alert("Wysłano")
                        console.log(this.state.name + '\n' + this.state.category + '\n' + this.state.content + '\n')
                    }}
                    >
                        Wyślij propozycję
                    </Button>
                </Form>
            </Container>
        )
    }
}
