import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            buttonText: "Send Friend Request"
        };
        this.updateFriendship = this.updateFriendship.bind(this);
    }
    componentDidMount() {
        var self = this;
        axios
            .get("/get-initial-status/" + self.props.otherUserId)
            .then(resp => {
                if (resp.data.accepted == true) {
                    self.setState({
                        buttonText: "Unfriend"
                    });
                } else if (
                    resp.data.sender_id == self.props.otherUserId &&
                    resp.data.accepted == false
                ) {
                    self.setState({
                        buttonText: "Accept new friend"
                    });
                } else if (
                    resp.data.sender_id !== self.props.otherUserId &&
                    resp.data.accepted == false
                ) {
                    self.setState({
                        buttonText: "Cancel friend request"
                    });
                } else {
                    self.setState({
                        buttonText: "Send Friend Request"
                    });
                }
            });
    }
    updateFriendship() {
        var self = this;
        axios
            .post("/updatefriend/" + self.props.otherUserId, {
                action: self.state.buttonText
            })
            .then(resp => {
                if (self.state.buttonText == "Accept new friend") {
                    self.setState({
                        buttonText: "Unfriend"
                    });
                } else if (
                    self.state.buttonText == "Cancel friend request" ||
                    "Unfriend"
                ) {
                    console.log("post: resp.data.cancel: ", resp.data.accepted);
                    self.setState({
                        buttonText: "Send Friend Request"
                    });
                } else if (self.state.buttonText == "Send Friend Request") {
                    console.log(
                        "post: resp.data.befriend: ",
                        resp.data.accepted
                    );
                    self.setState({
                        buttonText: "Cancel friend request"
                    });
                }
            });
    }

    getStyle() {
        var self = this;
        if (
            self.state.buttonText == "Send Friend Request" ||
            self.state.buttonText == "Accept new friend"
        ) {
            return {
                backgroundColor: "#86E4C0"
            };
        } else {
            return {
                backgroundColor: "#FEC12A"
            };
        }
    }

    render() {
        var self = this;

        return (
            <div>
                <button style={self.getStyle()} onClick={self.updateFriendship}>
                    {self.state.buttonText}
                </button>
            </div>
        );
    }
}
