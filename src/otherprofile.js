import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        var self = this;

        axios
            .get("/user/" + this.props.match.params.id + "/json")
            .then(function(result) {
                if (result.data.redirectTo) {
                    self.props.history.push(result.data.redirectTo);
                } else {
                    self.setState({
                        first: result.data.first,
                        last: result.data.last,
                        url: result.data.url,
                        bio: result.data.bio,
                        id: result.data.id
                    });
                }
            })
            .catch(err => {
                console.log("error in get/user ID: ", err);
            });
    }
    render() {
        return (
            <div>
                <div className="otherPic">
                    <img src={this.state.url} />
                </div>
                <div className="otherUser">
                    <h1>
                        {this.state.first} {this.state.last}
                    </h1>
                    <p>{this.state.bio}</p>
                    <FriendButton otherUserId={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}
