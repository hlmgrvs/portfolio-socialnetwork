import React from "react";
import axios from "./axios";

export default class Bioeditor extends React.Component {
    constructor(props) {
        super(props);
        this.handleEditing = this.handleEditing.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.state = {
            showEditor: false,
            bioText: ""
        };
    }
    updateBio() {
        axios
            .post("/bio", { bioText: this.state.bioText })
            .then(({ data }) => {
                console.log("data bio", data);
                this.props.updateUserBio(data.bio);
            })
            .catch(err => {
                console.log("error in post/bio: ", err);
            });
        this.setState(() => {
            return {
                showEditor: false
            };
        });
    }
    handleEditing() {
        this.setState(() => {
            return {
                showEditor: true
            };
        });
    }

    handleChange(e) {
        this.setState({
            bioText: e.target.value
        });
    }

    render() {
        return (
            <div className="bioeditor">
                <h1>Bio</h1>
                {this.props.bio ? (
                    <div>
                        <p>{this.props.bio}</p>{" "}
                        <button onClick={this.handleEditing}>Edit Bio</button>
                    </div>
                ) : (
                    <div>
                        No Bio{" "}
                        <button onClick={this.handleEditing}>Add Bio</button>
                    </div>
                )}
                {this.state.showEditor && (
                    <div>
                        <textarea
                            name="textarea"
                            placeholder="Enter Bio Here"
                            onChange={this.handleChange}
                        />{" "}
                        <button onClick={this.updateBio}>Save Bio</button>
                    </div>
                )}
            </div>
        );
    }
}
