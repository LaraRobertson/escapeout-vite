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
                        className={"light-dark"}
                        textAlign="center"
                        padding="0px 20px 20px 20px">
                        Create an Account or Login to play games.
                    </Heading>
                <View className="auth-wrapper">
                    <Authenticator></Authenticator>
                </View>
            </View>
        </View>

    );
}