import {Link, View} from "@aws-amplify/ui-react";
import {format} from "date-fns";
import React from "react";

export default function Footer() {
    return (
        <View ariaLabel={"footer"} className={"main-content"} marginTop="1em">
            <View textAlign="center"> © 2022 - {format(Date(), "yyyy")} EscapeOut.Games<br/>
                <Link
                    href="https://escapeout.games/privacy-policy/"
                    isExternal={true}
                    textDecoration="underline"
                >
                    Privacy Policy
                </Link> |&nbsp;
                <Link
                    href="https://escapeout.games/terms-of-service/"
                    isExternal={true}
                    textDecoration="underline"
                >
                    Terms of Service
                </Link>
            </View>
        </View>
    )
}