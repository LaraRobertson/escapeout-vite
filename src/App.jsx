/* src/App.jsx */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './RequireAuthLogin';
import { Authenticator } from "@aws-amplify/ui-react";

/* routes */
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { Game } from './pages/Game';
import { GameV3 } from './pages/GameV3';

/* error message */
import { Layout } from './components/Layout';

/* is this necessary, amplify config is in main.jsx */
/*import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);*/

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
                            path="/gameV3"
                            element={
                                <RequireAuth>
                                    <GameV3 />
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

export default App;
