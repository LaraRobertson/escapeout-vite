/* src/App.jsx */
import { BrowserRouter, Routes, Route } from 'react-router-dom';

/* routes */
import { Login } from './routes/Login';
import { Home } from './routes/Home';
import { Admin } from './routes/Admin';
import { Game } from './routes/Game';
import { GameV3 } from './routes/GameV3';

/* error message */
import { Layout } from './components/Layout';

/* is this necessary, amplify config is in main.jsx */
/*import '@aws-amplify/ui-react/styles.css';
import { Amplify } from 'aws-amplify';
import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);*/

/* why signout, user? see https://docs.amplify.aws/react/build-a-backend/auth/set-up-auth/ */
const App = () => {
    console.log("window.location.pathname: " + window.location.pathname);
    function MyRoutes() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                        <Layout />
                        }
                    >
                        <Route index element={<Home />}/>
                        <Route
                            path="/game"
                            element={<Game />}
                        />
                        <Route
                            path="/gameV3"
                            element={<GameV3 />}
                        />
                        <Route
                            path="/admin"
                            element={<Admin />}
                        />
                        <Route
                            path="/login"
                            element={<Login />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        );
    }

    return (

            <MyRoutes  />

    );

};

export default App;
