import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import Uploader from "./uploader";
import { Profile } from "./profile";
import OtherProfile from "./otherprofile";
import { Connections } from "./friends";
import { Header } from "./navbar";
import { OnlineConnections } from "./online";
import { ChatConnections } from "./chat";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.handleShowUploader = this.handleShowUploader.bind(this);
        this.updateProfileUrl = this.updateProfileUrl.bind(this);
        this.updateUserBio = this.updateUserBio.bind(this);
        this.state = {
            uploaderIsVisible: false
        };
    }
    handleShowUploader() {
        this.setState(() => {
            return {
                uploaderIsVisible: true
            };
        });
    }
    updateProfileUrl(url) {
        this.setState(() => {
            return {
                url: url,
                uploaderIsVisible: false
            };
        });
    }
    updateUserBio(bio) {
        console.log("updateUserBio running");
        this.setState(() => {
            console.log("this.updateUserBio: ", this.updateUserBio);
            return {
                bio: bio,
                showEditor: false
            };
        });
    }
    componentDidMount() {
        axios
            .get("/user")
            .then(response => {
                // console.log("response.data: ", response.data);
                this.setState({
                    id: response.data.id,
                    first: response.data.first,
                    last: response.data.last,
                    url: response.data.url,
                    bio: response.data.bio
                });
            })
            .catch(err => {
                console.log("error in get/user: ", err);
            });
    }

    render() {
        return (
            <div className="main-container">
                {this.state.uploaderIsVisible && (
                    <Uploader updateProfileUrl={this.updateProfileUrl} />
                )}
                <BrowserRouter>
                    <div>
                        <Header
                            first={this.state.first}
                            last={this.state.last}
                            url={this.state.url}
                        />
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    id={this.state.id}
                                    first={this.state.first}
                                    last={this.state.last}
                                    url={this.state.url}
                                    handleShowUploader={this.handleShowUploader}
                                    bio={this.state.bio}
                                    updateUserBio={this.updateUserBio}
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/friends" render={() => <Connections />} />
                        <Route
                            path="/online"
                            render={() => <OnlineConnections />}
                        />
                        <Route
                            path="/chat"
                            render={() => <ChatConnections />}
                        />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
