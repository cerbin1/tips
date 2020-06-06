import React from "react";
import Container from "react-bootstrap/Container";
import Logo from "./Logo";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import {Link} from "react-router-dom";

const AdviceCategories = () => {

    const categories = [
        {
            id: 1,
            advicesCount: 15,
            name: "Rozwój osobisty",
        },
        {
            id: 2,
            advicesCount: 102,
            name: "Dom",
        },
        {
            id: 3,
            advicesCount: 52,
            name: "Praca",
        },
        {
            id: 4,
            advicesCount: 0,
            name: "Zwierzęta",
        },
    ];

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <Logo/>
                    </Col>
                </Row>
                <Row>
                    <h1>Kategorie porad</h1>
                </Row>
                <Row>
                    <Table striped bordered hover variant="dark">
                        <thead>
                        <tr>
                            <th>Kategoria</th>
                            <th>Liczba porad</th>
                            <th>Nawigacja</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map(category => {
                            return (
                                <tr key={category.id}>
                                    <td>{category.name}</td>
                                    <td>{category.advicesCount}</td>
                                    <td>
                                        <Link className="btn btn-primary" to={{
                                            pathname: '/categories/' + category.id
                                        }}>Wyświetl porady</Link>
                                    </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </Table>
                </Row>
            </Container>
        </div>
    )
};

export default AdviceCategories;
