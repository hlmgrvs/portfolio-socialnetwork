import React from "react";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <header>
                <div>
                    <Navbar
                        collapseOnSelect
                        expand="lg"
                        bg="dark"
                        variant="dark"
                    >
                        <ProfilePic url={this.props.url} />
                        <Navbar.Brand>
                            <Link to="/" id="profile-link">
                                {this.props.first} {this.props.last}
                            </Link>
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="mr-auto">
                                <Nav.Link>
                                    <Link to="/" id="profile-link">
                                        My profile
                                    </Link>
                                </Nav.Link>
                                <Nav.Link>
                                    <Link to="/chat" id="chat-link">
                                        Chat
                                    </Link>
                                </Nav.Link>
                                <NavDropdown
                                    title="Friends"
                                    id="collasible-nav-dropdown"
                                >
                                    <NavDropdown.Item>
                                        <Link to="/friends" id="friends-link">
                                            My Friends
                                        </Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link to="/online" id="online-link">
                                            Online users
                                        </Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link to="/chat" id="chat-link">
                                            Chat
                                        </Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </header>
        );
    }
}
