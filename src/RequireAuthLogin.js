// RequireAuth.js
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthenticator, View } from '@aws-amplify/ui-react';

export function RequireAuth({ children })
{   const location = useLocation();
    const navigate = useNavigate();
    const { route } = useAuthenticator((context) => [context.route]);

    if (route !== 'authenticated') {
        navigate('/');
    }
    return children;
}