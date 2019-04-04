import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Online extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log("this.props: ", this.props);
        if (!this.props.onlineUsers) {
            return null;
        }
        return (
            <div className="onlineUsers">
                <div className="onlineUsersListContainer">
                    {this.props.onlineUsers.length > 0 && <h2>Online now:</h2>}
                    {this.props.onlineUsers.length == 0 && (
                        <h2>No other users online now.</h2>
                    )}
                    {this.props.onlineUsers && (
                        <div className="onlineUserContainer">
                            {this.props.onlineUsers &&
                                this.props.onlineUsers.map(i => {
                                    return (
                                        <div
                                            key={i.id}
                                            className="onlineUserItem"
                                        >
                                            {
                                                <Link
                                                    to={`/user/${i.id}`}
                                                    key={i.id}
                                                >
                                                    <div className="onlineUserItemPicture">
                                                        <img
                                                            src={
                                                                i.url ||
                                                                "/empty-profile.jpg"
                                                            }
                                                        />
                                                    </div>
                                                    <div className="onlineUserItemInfo">
                                                        <p>
                                                            {i.first} {i.last}
                                                        </p>
                                                    </div>
                                                </Link>
                                            }
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    if (!state.onlineUsers) {
        return {};
    } else {
        return {
            onlineUsers: state.onlineUsers
        };
    }
};

export let OnlineConnections = connect(mapStateToProps)(Online);
