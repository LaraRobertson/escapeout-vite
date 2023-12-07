/* src/App.jsx */
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { RequireAuth } from './RequireAuthLogin';
import { Login } from './components/Login';
import { Home } from './components/Home';
import { Admin } from './components/Admin';
import { Layout } from './components/Layout';

import PropTypes from 'prop-types'
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/api';

import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';

import { Authenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import amplifyconfig from './amplifyconfiguration.json';
Amplify.configure(amplifyconfig);

const initialState = { name: '', description: '' };
const client = generateClient();

const App = ({ signOut, user }) => {
    const [formState, setFormState] = useState(initialState);
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        fetchTodos();
    }, []);

    function setInput(key, value) {
        setFormState({ ...formState, [key]: value });
    }

    async function fetchTodos() {
        try {
            const todoData = await client.graphql({
                query: listTodos
            });
            const todos = todoData.data.listTodos.items;
            setTodos(todos);
        } catch (err) {
            console.log('error fetching todos');
        }
    }

    async function addTodo() {
        try {
            if (!formState.name || !formState.description) return;
            const todo = { ...formState };
            setTodos([...todos, todo]);
            setFormState(initialState);
            await client.graphql({
                query: createTodo,
                variables: {
                    input: todo
                }
            });
        } catch (err) {
            console.log('error creating todo:', err);
        }
    }

    function MyRoutes() {
        return (
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout/>}>
                        <Route index element={<Home />}/>
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

App.propTypes = {
    signOut: PropTypes.func,
    user: PropTypes.object
}


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
