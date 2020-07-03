import React from "react";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {Navbar as BootstrapNavbar} from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Content from "./Content";
import TestComponent from "./TestComponent";
import AdviceDetails from "./AdviceDetails";
import AdviceCategories from "./AdviceCategories";
import AdviceCategory from "./AdviceCategory";
import {Ranking} from "./Ranking";

const Menu = () => {
    return (
        <Router>
            <BootstrapNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Link to={"/"}>
                    <BootstrapNavbar.Brand>[home icon] Afterady</BootstrapNavbar.Brand>
                </Link>
                <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav"/>
                <BootstrapNavbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to={"/categories"}>Kategorie</Nav.Link>
                        <Nav.Link as={Link} to={"/ranking"}>Ranking</Nav.Link>
                        <Nav.Link as={Link} to={"/test"}>Zaproponuj</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider/>
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#deets">More deets</Nav.Link>
                        <Nav.Link eventKey={2} href="#memes">
                            Dank memes
                        </Nav.Link>
                    </Nav>
                </BootstrapNavbar.Collapse>
            </BootstrapNavbar>

            <Switch>
                <Route default exact path={"/"} component={Content}/>
                <Route exact path={"/test"} component={TestComponent}/>
                <Route exact path="/advices/:adviceId" component={AdviceDetails}/>
                <Route exact path={"/categories"} component={AdviceCategories}/>
                <Route exact path="/categories/:categoryId" component={AdviceCategory}/>
                <Route exact path="/ranking" component={Ranking}/>
            </Switch>
        </Router>
    )
};

export default Menu;
