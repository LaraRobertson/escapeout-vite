import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

/* all you need to configure Amplify */
/* As you add or remove categories and make updates
to your backend configuration using the Amplify CLI, the configuration in
amplifyconfiguration.json will update automatically. */
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);
/* end configure amplify */

/* https://ui.docs.amplify.aws/react/connected-components/authenticator/advanced */
/* react hook that can be used to access, modify, and update Authenticator's auth state */
/* to use must wrap your application (APpp) with <Authenticator.Provider> */
import { Authenticator } from "@aws-amplify/ui-react";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
            <Authenticator.Provider>
                <App />
            </Authenticator.Provider>
    </React.StrictMode>,
)
