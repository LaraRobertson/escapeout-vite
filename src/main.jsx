import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Amplify } from 'aws-amplify';
import { Authenticator } from "@aws-amplify/ui-react";
import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
            <Authenticator.Provider>
                <App />
            </Authenticator.Provider>
    </React.StrictMode>,
)
