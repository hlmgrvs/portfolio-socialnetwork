import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { initSocket } from "./socket";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messageText: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }
    componentDidUpdate() {
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    componentDidMount() {
        if (!this.elem) {
            return null;
        }
        this.elem.scrollTop = this.elem.scrollHeight;
    }
    handleChange(e) {
        this.setState({
            messageText: e.target.value
        });
    }
    sendMessage() {
        initSocket().emit("chatMessageFromTextArea", this.state.messageText);
        this.setState({
            messageText: ""
        });
    }
    render() {
        console.log("this.props from chat: ", this.props);
        if (!this.props.chatMessages) {
            return null;
        }
        return (
            <div>
                <div className="chat">
                    {this.props.chatMessages.length == 0 && (
                        <p id="noMessages">No messages posted...</p>
                    )}
                    {this.props.chatMessages && (
                        <div
                            className="message-area"
                            ref={elem => (this.elem = elem)}
                        >
                            {this.props.chatMessages &&
                                this.props.chatMessages.map(i => {
                                    return (
                                        <div
                                            key={i.message_id}
                                            className="chat-message"
                                        >
                                            <Link to={`/user/${i.sender_id}`}>
                                                <img
                                                    src={
                                                        i.sender_url ||
                                                        "/empty-profile.jpg"
                                                    }
                                                />
                                            </Link>
                                            <div className="message-info">
                                                <p>
                                                    <span className="message-sender">
                                                        {i.sender_first}{" "}
                                                        {i.sender_last}
                                                    </span>{" "}
                                                    <span className="message-date">
                                                        on{" "}
                                                        {i.message_created_at.slice(
                                                            0,
                                                            10
                                                        )}
                                                        ,{" "}
                                                        {i.message_created_at.slice(
                                                            14,
                                                            19
                                                        )}
                                                    </span>
                                                </p>
                                                <p className="message-content">
                                                    {i.message}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                    <div className="message-input">
                        <textarea
                            value={this.state.messageText}
                            onChange={this.handleChange}
                        />
                        <button onClick={this.sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    if (!state.chatMessages) {
        return {};
    } else {
        return {
            chatMessages: state.chatMessages
        };
    }
};

export let ChatConnections = connect(mapStateToProps)(Chat);
