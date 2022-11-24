import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import "./styles/styles.css";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";
import { MessageContextProvider } from "./context/MessageContext";

import TimeAgo from 'javascript-time-ago'

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthContextProvider>
    <ChatContextProvider>
      <MessageContextProvider>
        <React.StrictMode>
          <Router>
            <App />
          </Router>
        </React.StrictMode>
      </MessageContextProvider>
    </ChatContextProvider>
  </AuthContextProvider>
);
