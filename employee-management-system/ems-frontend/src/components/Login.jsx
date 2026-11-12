
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await AuthService.login({
                email: email.trim(),
                password
            });

            // Verify that the session is available.
            await AuthService.getCurrentAdmin();

            navigate('/', { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-card" onSubmit={handleLogin}>
                <h1>Admin Login</h1>
                <p>Sign in to your Employee Management System</p>

                {error && (
                    <div className="auth-error">{error}</div>
                )}

                <label htmlFor="login-email">Email</label>
                <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="username"
                    required
                />

                <label htmlFor="login-password">Password</label>
                <input
                    id="login-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                />

                {/* Forgot Password link */}
                <p className="auth-link">
                    <Link to="/forgot-password">
                        Forgot Password?
                    </Link>
                </p>

                <button type="submit" disabled={loading}>
                    {loading ? 'Signing in...' : 'Login'}
                </button>

                <p className="auth-link">
                    First time here?{' '}
                    <Link to="/register">Register Admin</Link>
                </p>
            </form>
        </div>
    );
}

export default Login;

