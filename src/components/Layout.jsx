// components/Layout.jsx
import React, {useState} from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {View} from '@aws-amplify/ui-react';

/***** reference for hooks/methods for auth ******/
/* https://docs.amplify.aws/react/build-a-backend/auth/manage-user-profile/ */
/*************************************************/

/* do not think we are setting errorInternet - could set if api call doesn't work? */
export function Layout() {
    const [errorInternet, setErrorInternet] = useState(false);

    const ErrorComponent = (s) => {
        console.log("error in component: " + errorInternet);
        let className = "hide main-container";
        errorInternet ? className ="show main-container" : className="hide main-container";
        return (
            <View className={className} >
                <View className="main-content">There are errors (probably no internet) and your data did not save.
                    <br />
                    Your progress is not lost.
                    <br />
                    Please do not close window so that your progress can be saved.
                </View>
            </View>
        )
    }

    const location = useLocation();
    console.log("location: " + location.pathname);

    return (
        <View>
            <ErrorComponent />
            <Outlet />
        </View>
    );
}