// RequireAuth.js
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export function RequireAuth({ children })
{
    const location = useLocation();
    const { authStatus } = useAuthenticator((context) => [
        context.authStatus])
    console.log("authStatus (RequireAuth): " + authStatus);
    if (authStatus != 'authenticated') {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
}