import React from 'react';
import ReactDOM from 'react-dom/client';
import {generateClient} from "aws-amplify/api";
import App from './App.jsx';
import './index.css';

/* https://ui.docs.amplify.aws/react/connected-components/authenticator/advanced */
/* react hook that can be used to access, modify, and update Authenticator's auth state */
/* to use must wrap your application (APpp) with <Authenticator.Provider> */
import { Authenticator } from "@aws-amplify/ui-react";

/* all you need to configure Amplify */
/* As you add or remove categories and make updates
to your backend configuration using the Amplify CLI, the configuration in
amplifyconfiguration.json will update automatically. */
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';


const isLocalhost = Boolean(
    window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

if (isLocalhost) {
    amplifyconfig.oauth.redirectSignIn = "http://localhost:5173/"
    amplifyconfig.oauth.redirectSignOut = "http://localhost:5173/"
} else if (window.location.hostname === 'dev.play.escapeout.games') {
    amplifyconfig.oauth.redirectSignIn = "https://dev.play.escapeout.games/"
    amplifyconfig.oauth.redirectSignOut = "https://dev.play.escapeout.games/"
} else if (window.location.hostname === 'play.escapeout.games') {
    amplifyconfig.oauth.redirectSignIn = "https://play.escapeout.games/"
    amplifyconfig.oauth.redirectSignOut = "https://play.escapeout.games/"
} else {
    console.log('This is not possible')
}

Amplify.configure(amplifyconfig);
/* end configure amplify */


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
            <Authenticator.Provider>
                <App />
            </Authenticator.Provider>
    </React.StrictMode>,
)
