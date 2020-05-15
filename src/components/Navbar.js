import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import React from "react";
import {Navbar as BootstrapNavbar} from "react-bootstrap";

const Navbar = () => {
    return (
        <div>
            <BootstrapNavbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <BootstrapNavbar.Brand href="#home">[home icon] Afterady</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="responsive-navbar-nav"/>
                <BootstrapNavbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#categories">Kategorie</Nav.Link>
                        <Nav.Link href="#ranking">Ranking</Nav.Link>
                        <Nav.Link href="#suggest">Zaproponuj</Nav.Link>
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
        </div>)
};
export default Navbar;
