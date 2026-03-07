import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock } from 'react-icons/fa';

const styles = {
    page: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
    },
    container: {
        display: 'flex',
        borderRadius: '20px',
        overflow: 'hidden',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5)',
        maxWidth: '900px',
        width: '100%',
        minHeight: '500px',
    },
    leftPanel: {
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 40px',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
    },
    leftOverlay: {
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)',
        pointerEvents: 'none',
    },
    leftTitle: {
        fontSize: '32px',
        fontWeight: '700',
        marginBottom: '16px',
        zIndex: 1,
        textAlign: 'center',
    },
    leftSubtitle: {
        fontSize: '16px',
        opacity: 0.85,
        lineHeight: 1.6,
        zIndex: 1,
        textAlign: 'center',
        maxWidth: '280px',
    },
    rightPanel: {
        flex: 1,
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '50px 40px',
    },
    formTitle: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1a1a2e',
        marginBottom: '8px',
    },
    formSubtitle: {
        fontSize: '14px',
        color: '#888',
        marginBottom: '32px',
    },
    inputGroup: {
        position: 'relative',
        marginBottom: '22px',
    },
    inputIcon: {
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#aaa',
        fontSize: '16px',
        zIndex: 2,
    },
    input: {
        width: '100%',
        padding: '14px 48px 14px 46px',
        border: '2px solid #e8e8e8',
        borderRadius: '12px',
        fontSize: '15px',
        outline: 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        background: '#f8f9fc',
        boxSizing: 'border-box',
    },
    inputFocus: {
        borderColor: '#667eea',
        boxShadow: '0 0 0 4px rgba(102, 126, 234, 0.15)',
        background: '#fff',
    },
    eyeBtn: {
        position: 'absolute',
        right: '14px',
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        color: '#aaa',
        cursor: 'pointer',
        fontSize: '18px',
        padding: '4px',
        zIndex: 2,
    },
    error: {
        color: '#e74c3c',
        fontSize: '13px',
        marginTop: '6px',
        paddingLeft: '4px',
    },
    submitBtn: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
        marginTop: '8px',
        letterSpacing: '0.5px',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '24px',
        fontSize: '14px',
        color: '#888',
    },
    link: {
        color: '#667eea',
        fontWeight: '600',
        textDecoration: 'none',
    },
    successOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        animation: 'fadeInOverlay 0.4s ease',
    },
    successBox: {
        background: '#fff',
        borderRadius: '24px',
        padding: '48px 56px',
        textAlign: 'center',
        boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
        animation: 'popInBox 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    },
    successIcon: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #4CAF50, #8BC34A)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        fontSize: '36px',
        color: '#fff',
        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.4)',
        animation: 'checkPop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both',
    },
    successText: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#1a1a2e',
        animation: 'fadeSlideUp 0.5s ease 0.5s both',
    },
    successSub: {
        fontSize: '14px',
        color: '#999',
        marginTop: '10px',
        animation: 'fadeSlideUp 0.5s ease 0.7s both',
    },
};

function Login() {
    const history = useHistory();
    const [values, setValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [loggedIn, setLoggedIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [loading, setLoading] = useState(false);

    const handleInput = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!values.email || !values.password) {
            setErrors({ password: 'Please fill in all fields' });
            return;
        }
        setLoading(true);

        fetch('/loginpg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        })
        .then(res => res.json())
        .then(data => {
            setLoading(false);
            if (data === "Success") {
                localStorage.setItem('email', values.email);
                localStorage.setItem('loggedIn', true);
                setLoggedIn(true);
                setTimeout(() => history.push('/home'), 2000);
            } else {
                setErrors({ password: "Incorrect email or password" });
            }
        })
        .catch(() => {
            setLoading(false);
            setErrors({ password: "Server error. Please try again." });
        });
    };

    return (
        <div style={styles.page}>
            {loggedIn && (
                <div style={styles.successOverlay}>
                    <div style={styles.successBox}>
                        <div style={styles.successIcon}>&#10003;</div>
                        <div style={styles.successText}>Welcome back!</div>
                        <div style={styles.successSub}>Redirecting to dashboard...</div>
                    </div>
                </div>
            )}
            <div style={styles.container}>
                <div style={styles.leftPanel}>
                    <div style={styles.leftOverlay}></div>
                    <div style={styles.leftTitle}>Welcome Back</div>
                    <div style={styles.leftSubtitle}>
                        Sign in to access your dashboard, manage your data, and stay connected.
                    </div>
                </div>
                <div style={styles.rightPanel}>
                    <div style={styles.formTitle}>Sign In</div>
                    <div style={styles.formSubtitle}>Enter your credentials to continue</div>
                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <FaEnvelope style={styles.inputIcon} />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email address"
                                value={values.email}
                                onChange={handleInput}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField('')}
                                style={{
                                    ...styles.input,
                                    ...(focusedField === 'email' ? styles.inputFocus : {}),
                                }}
                            />
                        </div>
                        <div style={styles.inputGroup}>
                            <FaLock style={styles.inputIcon} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="Password"
                                value={values.password}
                                onChange={handleInput}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField('')}
                                style={{
                                    ...styles.input,
                                    ...(focusedField === 'password' ? styles.inputFocus : {}),
                                }}
                            />
                            <button
                                type="button"
                                style={styles.eyeBtn}
                                onClick={() => setShowPassword(prev => !prev)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.password && <div style={styles.error}>{errors.password}</div>}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                ...styles.submitBtn,
                                opacity: loading ? 0.7 : 1,
                            }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.5)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.4)'; }}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                    <div style={styles.linkText}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={styles.link}>Create one</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
