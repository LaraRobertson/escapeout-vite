// components/Login.jsx
import React, {useEffect, useState} from "react";

import {Authenticator, Button, Flex, Heading, Image, useAuthenticator, View} from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

import { useNavigate, useLocation } from 'react-router';
import {fetchUserAttributes} from "aws-amplify/auth";

async function handleFetchUserAttributes() {
    try {
        const userAttributes = await fetchUserAttributes();
        console.log("userAttributes.email",userAttributes.email);
        localStorage.setItem("email",userAttributes.email);
    } catch (error) {
        console.log(error);
    }
}

export function Login() {
    const { route } = useAuthenticator((context) => [context.route]);
    const location = useLocation();
    const navigate = useNavigate();
    let from = location.state?.from?.pathname || '/';
    useEffect(() => {
        if (route === 'authenticated') {
            navigate(from, { replace: true });
        }
    }, [route, navigate, from]);
    return (
        <View className="main-container">
                <View className="topNav">
                    <Flex justifyContent="center">
                        <View marginTop="10px">
                            <Image src="https://escapeoutbucket213334-staging.s3.amazonaws.com/public/new-logo-light-smaller.png" />
                        </View>
                    </Flex>
                    <Flex justifyContent="center">
                        <Button className="topLink" onClick={() => navigate('/')}>Back to Home</Button>
                    </Flex>
                </View>
            <View className="main-content light-dark top-main">
                    <Heading
                        level={4}
                        className={"light small"}
                        textAlign="center"
                        padding="20px">
                        Create an Account or Sign In to play games. If you use your google account you do not have to authenticate your email. If you don't use your google account, A code will be sent to your email.
                    <br />note: if you want to play with other people and let them use your email to sign in, create an account with your email and a simple password so you can share. We do
                    not collect any sensitive data.</Heading>
                <View className="auth-wrapper">
                    <Authenticator></Authenticator>
                </View>
            </View>
        </View>

    );
}