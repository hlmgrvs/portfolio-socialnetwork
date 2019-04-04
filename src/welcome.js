import React from "react";
import { HashRouter, Route, Link } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";

export function Welcome() {
    return (
        <div className="welcome">
            <h1>Welcome to BotBook</h1>
            <h2>Connect with bots and the world around you on BotBook!</h2>
            <HashRouter>
                <div>
                    <Route path="/register" component={Registration} />
                    <Route path="/login" component={Login} />
                    <h3>
                        <Link to="/register"> Registration </Link>
                    </h3>
                    <h3>
                        <Link to="/login"> Login </Link>
                    </h3>
                </div>
            </HashRouter>
        </div>
    );
}
