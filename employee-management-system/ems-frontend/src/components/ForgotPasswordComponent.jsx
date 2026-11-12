
import { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/forgot-password";

function ForgotPasswordComponent() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const sendOtp = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/send-otp`,
                { email }
            );

            setMessage(response.data.message);
            setStep(2);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to send OTP. Check your email configuration."
            );
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");

        if (newPassword.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_URL}/reset`,
                { email, otp, newPassword }
            );

            setMessage(response.data.message);
            setStep(3);
            setOtp("");
            setNewPassword("");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Password reset failed. Check the OTP and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.heading}>Forgot Password?</h2>

                <p style={styles.subtitle}>
                    Reset your Employee Management System admin password.
                </p>

                {message && (
                    <p style={styles.success}>{message}</p>
                )}

                {error && (
                    <p style={styles.error}>{error}</p>
                )}

                {step === 1 && (
                    <form onSubmit={sendOtp} autoComplete="off">
                        <label style={styles.label}>
                            Registered Email
                        </label>

                        <input
                            style={styles.input}
                            type="email"
                             autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            required
                        />

                        <button
                            style={styles.button}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send OTP"}
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={resetPassword}>
                        <label style={styles.label}>
                            Verification OTP
                        </label>

                        <input
                            style={styles.input}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]{6}"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            required
                        />

                        <label style={styles.label}>
                            New Password
                        </label>

                        <input
                            style={styles.input}
                            type="password"
                             autoComplete="new-password"
                            minLength={8}
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(e.target.value)
                            }
                            placeholder="Enter new password"
                            required
                        />

                        <button
                            style={styles.button}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>

                        <button
                            style={styles.secondaryButton}
                            type="button"
                            disabled={loading}
                            onClick={() => {
                                setStep(1);
                                setOtp("");
                                setNewPassword("");
                                setMessage("");
                                setError("");
                            }}
                        >
                            Back
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <button
                        style={styles.button}
                        onClick={() => {
                            window.location.href = "/login";
                        }}
                    >
                        Go to Login
                    </button>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: {
        minHeight: "75vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f6fb",
        padding: "24px",
    },
    card: {
        width: "100%",
        maxWidth: "420px",
        background: "#ffffff",
        padding: "32px",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
    },
    heading: {
        color: "#163a70",
        textAlign: "center",
        marginBottom: "10px",
    },
    subtitle: {
        textAlign: "center",
        color: "#64748b",
        marginBottom: "24px",
    },
    label: {
        display: "block",
        marginTop: "16px",
        marginBottom: "8px",
        fontWeight: "600",
        color: "#334155",
    },
    input: {
        width: "100%",
        boxSizing: "border-box",
        padding: "12px",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        fontSize: "15px",
    },
    button: {
        width: "100%",
        marginTop: "20px",
        padding: "12px",
        background: "#2459a9",
        color: "#ffffff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "600",
    },
    secondaryButton: {
        width: "100%",
        marginTop: "10px",
        padding: "12px",
        background: "#e2e8f0",
        color: "#334155",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
    },
    success: {
        color: "#166534",
        background: "#dcfce7",
        padding: "10px",
        borderRadius: "6px",
    },
    error: {
        color: "#b91c1c",
        background: "#fee2e2",
        padding: "10px",
        borderRadius: "6px",
    },
};

export default ForgotPasswordComponent;
