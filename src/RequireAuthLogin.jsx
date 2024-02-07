// RequireAuth.js
import { useLocation, Navigate } from 'react-router-dom';
import { useAuthenticator } from '@aws-amplify/ui-react';

export function RequireAuth({ children })
{
    const location = useLocation();
    const { authStatus, route } = useAuthenticator((context) => [
        context.authStatus,
        context.route])
    if (authStatus != 'authenticated' && route !="authenticated") {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
}