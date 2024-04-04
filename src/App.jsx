/* src/App.jsx */
import {BrowserRouter, Routes, Route, useLocation, Navigate} from 'react-router-dom';
import { RequireAuth } from './RequireAuthLogin';
import {Authenticator, useAuthenticator} from "@aws-amplify/ui-react";

/* routes */
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Admin } from './components/Admin';
import { Waiver } from './components/Waiver';
import { Game } from './components/Game';
import { LeaderBoard } from './components/LeaderBoard';


/* header and footer */
import { Layout } from './components/Layout';

import { Amplify } from 'aws-amplify';

import '@aws-amplify/ui-react/styles.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

/* why signout, user? see https://docs.amplify.aws/react/build-a-backend/auth/set-up-auth/ */
const App = () => {
    function MyRoutes() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Home />}/>
                        <Route
                            path="/game"
                            element={
                                <RequireAuth>
                                    <Game />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/admin"
                            element={
                                <RequireAuth>
                                    <Admin />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/waiver"
                            element={
                                <RequireAuth>
                                    <Waiver />
                                </RequireAuth>
                            }
                        />
                        <Route
                            path="/leaderboard"
                            element={
                                <LeaderBoard />
                            }
                        />
                        <Route
                            path="/login"
                            element={
                                <Login />
                            }
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }

    return (
        <Authenticator.Provider>
            <MyRoutes  />
        </Authenticator.Provider>
    );

};

const styles = {
    container: {
        width: 400,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 20
    },
    todo: { marginBottom: 15 },
    input: {
        border: 'none',
        backgroundColor: '#ddd',
        marginBottom: 10,
        padding: 8,
        fontSize: 18
    },
    todoName: { fontSize: 20, fontWeight: 'bold' },
    todoDescription: { marginBottom: 0 },
    button: {
        backgroundColor: 'black',
        color: 'white',
        outline: 'none',
        fontSize: 18,
        padding: '12px 0px'
    }
};

export default App;
