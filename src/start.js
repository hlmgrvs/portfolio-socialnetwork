import React from "react";
import ReactDOM from "react-dom";
import App from "./app";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducers";
import { Welcome } from "./welcome";
import { initSocket } from "./socket";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let thingToRender;

const elem = (
    <Provider store={store}>
        <App />
    </Provider>
);

if (location.pathname == "/welcome") {
    thingToRender = <Welcome />;
} else {
    thingToRender = (initSocket(store), elem);
}

ReactDOM.render(thingToRender, document.querySelector("main"));
