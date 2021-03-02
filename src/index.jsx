import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App.jsx";

import { Provider } from "react-redux";
import store from "./redux/store";

import "./index.scss";

const rootElement = document.getElementById("app");

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    rootElement,
);
