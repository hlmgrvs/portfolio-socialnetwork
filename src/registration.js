import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        axios
            .post("/register", {
                first: this.first,
                last: this.last,
                email: this.email,
                password: this.password
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("data.success: ", data.success);
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            })
            .catch(function(err) {
                console.log("err in axios post : ", err);
            });
    }
    render() {
        return (
            <div className="register-comp">
                {this.state.error && (
                    <div className="error">Something went wrong!</div>
                )}
                <h2>Registration</h2>
                <input
                    name="first"
                    placeholder="first name"
                    onChange={this.handleChange}
                />
                <input
                    name="last"
                    placeholder="last name"
                    onChange={this.handleChange}
                />
                <input
                    name="email"
                    placeholder="email"
                    onChange={this.handleChange}
                />
                <input
                    name="password"
                    placeholder="password"
                    type="password"
                    onChange={this.handleChange}
                />
                <button onClick={this.submit}>Register</button>
                <p>
                    Allready have an account? Log in{" "}
                    <Link to="/login"> here</Link>
                </p>
            </div>
        );
    }
}
