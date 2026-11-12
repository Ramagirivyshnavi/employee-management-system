
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

function ProtectedRoute({ children }) {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AuthService.getCurrentAdmin()
            .then(() => setAuthenticated(true))
            .catch(() => setAuthenticated(false))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <p>Checking login...</p>;
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
