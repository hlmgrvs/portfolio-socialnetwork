import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { receiveFriendsAndWannabes, confirmFriend, unfriend } from "./actions";

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(receiveFriendsAndWannabes());
    }
    render() {
        return (
            <div className="fw-list">
                <div className="wannabes">
                    {" "}
                    Pending friend Requests:
                    {this.props.wannabes &&
                        this.props.wannabes.map(i => {
                            return (
                                <div key={i.id}>
                                    <div className="wannabe">
                                        <img src={i.url} />
                                        {
                                            <Link
                                                to={`/user/${i.id}`}
                                                key={i.id}
                                            >
                                                {i.first} {i.last}
                                            </Link>
                                        }
                                        <button
                                            style={{
                                                backgroundColor: "#86E4C0"
                                            }}
                                            onClick={() =>
                                                this.props.dispatch(
                                                    confirmFriend(i.id)
                                                )
                                            }
                                        >
                                            Accept new friend
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <div className="friends">
                    {" "}
                    Accepted friend requests:
                    {this.props.friends &&
                        this.props.friends.map(i => {
                            return (
                                <div key={i.id}>
                                    <div className="friend">
                                        <img src={i.url} />
                                        {
                                            <Link
                                                to={`/user/${i.id}`}
                                                key={i.id}
                                            >
                                                {i.first} {i.last}
                                            </Link>
                                        }
                                        <button
                                            style={{
                                                backgroundColor: "#FEC12A"
                                            }}
                                            onClick={() =>
                                                this.props.dispatch(
                                                    unfriend(i.id)
                                                )
                                            }
                                        >
                                            Unfriend
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        );
    }
}

const mapStateToProps = function(state) {
    // console.log("state: ", state);
    if (!state.friendsAndWannabes) {
        return {};
    } else {
        return {
            friends: state.friendsAndWannabes.filter(i => {
                if (i.accepted) {
                    return true;
                } else {
                    return false;
                }
            }),
            wannabes: state.friendsAndWannabes.filter(i => {
                if (!i.accepted) {
                    return true;
                } else {
                    return false;
                }
            })
        };
    }
};

export let Connections = connect(mapStateToProps)(Friends);
