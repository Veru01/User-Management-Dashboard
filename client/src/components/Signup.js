import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa';

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
        minHeight: '560px',
    },
    leftPanel: {
        flex: 1,
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
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
        background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 60%)',
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
        opacity: 0.9,
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
        padding: '40px 40px',
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
        marginBottom: '28px',
    },
    inputGroup: {
        position: 'relative',
        marginBottom: '18px',
    },
    inputIcon: {
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#aaa',
        fontSize: '15px',
        zIndex: 2,
    },
    input: {
        width: '100%',
        padding: '13px 46px 13px 44px',
        border: '2px solid #e8e8e8',
        borderRadius: '12px',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
        background: '#f8f9fc',
        boxSizing: 'border-box',
    },
    inputFocus: {
        borderColor: '#f5576c',
        boxShadow: '0 0 0 4px rgba(245, 87, 108, 0.15)',
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
        fontSize: '12px',
        marginTop: '4px',
        paddingLeft: '4px',
    },
    submitBtn: {
        width: '100%',
        padding: '14px',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)',
        marginTop: '6px',
        letterSpacing: '0.5px',
    },
    linkText: {
        textAlign: 'center',
        marginTop: '22px',
        fontSize: '14px',
        color: '#888',
    },
    link: {
        color: '#f5576c',
        fontWeight: '600',
        textDecoration: 'none',
    },
    successOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    successBox: {
        background: '#fff',
        borderRadius: '20px',
        padding: '40px 50px',
        textAlign: 'center',
        boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
    },
    successIcon: {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #56ab2f, #a8e063)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
        fontSize: '32px',
        color: '#fff',
    },
    successText: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a2e',
    },
    successSub: {
        fontSize: '14px',
        color: '#888',
        marginTop: '8px',
    },
};

function Signup() {
    const [values, setValues] = useState({ name: '', mobile: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleInput = (e) => {
        const { name, value } = e.target;
        setValues(prev => ({ ...prev, [name]: value }));

        if (name === 'name' && !value.trim()) {
            setErrors(prev => ({ ...prev, name: 'Name is required' }));
        } else if (name === 'email' && !/\S+@\S+\.\S+/.test(value)) {
            setErrors(prev => ({ ...prev, email: 'Invalid email address' }));
        } else if (name === 'mobile' && (!value.trim() || isNaN(value) || value.length !== 10)) {
            setErrors(prev => ({ ...prev, mobile: 'Mobile should be 10-digit number' }));
        } else if (name === 'password' && (!value.trim() || !/(?=.*\d)(?=.*[A-Z]).{5,}/.test(value))) {
            setErrors(prev => ({ ...prev, password: 'Min 5 chars, 1 uppercase, 1 digit' }));
        } else {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, email, mobile, password } = values;

        if (!name.trim()) return setErrors({ name: 'Name is required' });
        if (!/\S+@\S+\.\S+/.test(email)) return setErrors({ email: 'Enter valid email' });
        if (!mobile.trim() || isNaN(mobile) || mobile.length !== 10) return setErrors({ mobile: 'Mobile should be 10-digit number' });
        if (!password.trim() || !/(?=.*\d)(?=.*[A-Z]).{5,}/.test(password)) return setErrors({ password: 'Min 5 chars, 1 uppercase, 1 digit' });

        setLoading(true);
        try {
            const res = await fetch("/signupadd", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, mobile, password }),
            });

            setLoading(false);
            if (res.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    history.push("/login");
                }, 2000);
            } else {
                const data = await res.json();
                if (data && data.error) {
                    setErrors({ email: data.error });
                } else {
                    setErrors({ email: "Something went wrong" });
                }
            }
        } catch {
            setLoading(false);
            setErrors({ email: "Server error. Please try again." });
        }
    };

    return (
        <div style={styles.page}>
            {showSuccess && (
                <div style={styles.successOverlay}>
                    <div style={styles.successBox}>
                        <div style={styles.successIcon}>&#10003;</div>
                        <div style={styles.successText}>Account Created!</div>
                        <div style={styles.successSub}>Redirecting to login...</div>
                    </div>
                </div>
            )}
            <div style={styles.container}>
                <div style={styles.leftPanel}>
                    <div style={styles.leftOverlay}></div>
                    <div style={styles.leftTitle}>Join Us</div>
                    <div style={styles.leftSubtitle}>
                        Create your account and start managing your data with powerful tools.
                    </div>
                </div>
                <div style={styles.rightPanel}>
                    <div style={styles.formTitle}>Create Account</div>
                    <div style={styles.formSubtitle}>Fill in your details to get started</div>
                    <form onSubmit={handleSubmit}>
                        <div style={styles.inputGroup}>
                            <FaUser style={styles.inputIcon} />
                            <input
                                type="text"
                                name="name"
                                placeholder="Full name"
                                value={values.name}
                                onChange={handleInput}
                                onFocus={() => setFocusedField('name')}
                                onBlur={() => setFocusedField('')}
                                style={{ ...styles.input, ...(focusedField === 'name' ? styles.inputFocus : {}) }}
                            />
                            {errors.name && <div style={styles.error}>{errors.name}</div>}
                        </div>
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
                                style={{ ...styles.input, ...(focusedField === 'email' ? styles.inputFocus : {}) }}
                            />
                            {errors.email && <div style={styles.error}>{errors.email}</div>}
                        </div>
                        <div style={styles.inputGroup}>
                            <FaPhone style={styles.inputIcon} />
                            <input
                                type="text"
                                name="mobile"
                                placeholder="Mobile number"
                                value={values.mobile}
                                onChange={handleInput}
                                onFocus={() => setFocusedField('mobile')}
                                onBlur={() => setFocusedField('')}
                                style={{ ...styles.input, ...(focusedField === 'mobile' ? styles.inputFocus : {}) }}
                            />
                            {errors.mobile && <div style={styles.error}>{errors.mobile}</div>}
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
                                style={{ ...styles.input, ...(focusedField === 'password' ? styles.inputFocus : {}) }}
                            />
                            <button type="button" style={styles.eyeBtn} onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                            {errors.password && <div style={styles.error}>{errors.password}</div>}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ ...styles.submitBtn, opacity: loading ? 0.7 : 1 }}
                            onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(245,87,108,0.5)'; }}
                            onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(245,87,108,0.4)'; }}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                    <div style={styles.linkText}>
                        Already have an account?{' '}
                        <Link to="/login" style={styles.link}>Sign in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;
