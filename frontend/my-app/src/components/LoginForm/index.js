import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt, FaUnlock } from "react-icons/fa";
import './index.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');  // State for error messages
    const [loading, setLoading] = useState(false);  // State for loading indicator
    const navigate = useNavigate();

    const submitForm = async event => {
        event.preventDefault();
        const userDetails = { username, password };
        console.log('Sending login details:', userDetails);
        
        const url = "http://localhost:5001/login"; // Removed trailing slash
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userDetails)
        };

        try {
            setLoading(true);  // Set loading to true
            const response = await fetch(url, options);

            if (!response.ok) {
                const errorData = await response.json();
                setErrorMessage(errorData.message);  // Set error message for frontend display
                console.error('Login error:', errorData.message);
            } else {
                const data = await response.json();
                console.log('Login successful:', data.message);

                if (data.message === "Login Successful!") {
                    navigate('/');  // Redirect to home page on successful login
                }
            }
        } catch (error) {
            console.error("Error during login:", error);
            setErrorMessage('An error occurred. Please try again later.');
        } finally {
            setLoading(false);  // Set loading back to false
        }
    };

    return (
        <div className='login-form-container'>
            <form className='form-container' onSubmit={submitForm}>
                <img
                    src='https://img.freepik.com/free-vector/news-concept-landing-page_23-2148203325.jpg'
                    className='login-website-logo-desktop-img image-logo'
                    alt='website logo'
                />
                
                <div>
                    <div className='input-container'>
                        <label className='input-label' htmlFor='username'>USERNAME</label>
                        <div className='input-contain'>
                            <FaUserAlt className='icon' />
                            <input
                                type='text'
                                id='username'
                                className='input-field'
                                value={username}
                                autoComplete='username'
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className='input-container'>
                        <label className='input-label' htmlFor='password'>PASSWORD</label>
                        <div className='input-contain'>
                            <FaUnlock className='icon' />
                            <input
                                type='password'
                                id='password'
                                className='input-field'
                                value={password}
                                autoComplete='current-password'
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {errorMessage && (
                        <p style={{ color: 'red' }} aria-live="assertive">{errorMessage}</p>  // Added aria-live
                    )}
                    <button className='login-button' type='submit' disabled={loading}>  {/* Disable button while loading */}
                        {loading ? 'Logging in...' : 'Login'} {/* Dynamic button text */}
                    </button>
                    <p>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: '#4CAF50' }}>Sign Up</Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
