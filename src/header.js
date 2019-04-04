import React from "react";
import { Link } from "react-router-dom";
import ProfilePic from "./profilepic";

export class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (
            <header>
                <div className="navbar">
                    <div className="navheader">
                        <h1>Welcome to BotBook</h1>
                        <h2>
                            Connect with bots and the world around you on
                            BotBook!
                        </h2>
                        <ul className="nav">
                            <li>
                                <Link to="/" id="profile-link">
                                    My profile
                                </Link>
                            </li>
                            <li>
                                <Link to="/friends" id="friends-link">
                                    My Friends
                                </Link>
                            </li>
                            <li>
                                <Link to="/online" id="online-link">
                                    Online users
                                </Link>
                            </li>
                            <li>
                                <Link to="/chat" id="chat-link">
                                    Chat
                                </Link>
                            </li>

                            <ProfilePic
                                first={this.props.first}
                                last={this.props.last}
                                url={this.props.url}
                            />
                        </ul>
                    </div>
                </div>
            </header>
        );
    }
}
