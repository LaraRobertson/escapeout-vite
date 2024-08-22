import {Button, Flex, Image, useAuthenticator, View} from "@aws-amplify/ui-react";
import React, {createContext, useContext} from "react";
import { useNavigate } from "react-router-dom";
import {removeLocalStorage} from "../helper";
import { MyAuthContext } from "../../MyContext";


export default function TopNav({setModalContent, signOut}) {
    const { authStatus, email } = useContext(MyAuthContext);

    const navigate = useNavigate();
    async function logOut() {
        console.log("logout");
        /* save everything for game? */
        /* warning? */
        removeLocalStorage();
        signOut();
    }
    return (
        <View className="topNav">
            <Flex justifyContent="center">
                <View marginTop="10px">
                    <Image
                        src="https://escapeoutbucket213334-staging.s3.amazonaws.com/public/new-logo-light-smaller.png"/>
                </View>
            </Flex>
            <Flex justifyContent="center">
                    {authStatus !== "authenticated" ? (
                        <Button className="topLink" onClick={() => navigate("/login")}>Sign in to Play</Button>
                    ) : (
                        <Button className="topLink" onClick={() => logOut()}>Sign Out</Button>
                    )
                    }

                    {authStatus === "authenticated" ? (
                        <Button className="topLink" onClick={() => setModalContent({
                            open: true,
                            content: "My Stats"
                        })}>
                            My Stats
                        </Button>) : (null)}
                    <Button className="topLink "  onClick={() => setModalContent({
                        open: true,
                        content: "How To Play"
                    })}>
                        How to Play
                    </Button>
                    {/*<Button onClick={() => Toggle()}>ModalLink</Button>*/}
                    {(authStatus === "authenticated") && (email === "lararobertson70@gmail.com") ? (
                        <Button className="topLink" onClick={() => navigate("/admin")}>Admin</Button>
                    ) : null}

            </Flex>
        </View>
    )
}