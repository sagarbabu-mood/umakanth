import { Component } from 'react';
import { IoMdContact } from "react-icons/io";
import { MdMarkEmailRead } from "react-icons/md";
import { MdOutlineScreenLockPortrait } from "react-icons/md";
import './index.css';

class Signup extends Component {
    constructor() {
        super();
        this.state = {
            username: '',
            password: '',
            email: '',
            showSubmitError: false,
            errorMessage: '' // State for dynamic error messages
        };
    }

    onSubmitFailure = (message) => {
        this.setState({
            showSubmitError: true,
            errorMessage: message, // Set dynamic error message
        });
    }

    onChangeUsername = (username) => {
        this.setState({ username: username.target.value });
    };

    onChangeEmail = (email) => {
        this.setState({ email: email.target.value });
    };

    onChangePassword = (password) => {
        this.setState({ password: password.target.value });
    };

    onSubmitForm = async (e) => {
        e.preventDefault();
        const { username, email, password } = this.state;
        console.log('Form Data Submitted:', this.state);

        try {
            const response = await fetch('http://localhost:5001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.message);
                // Optionally, navigate to another page or show a success message
            } else {
                console.log(data.error);
                this.onSubmitFailure(data.error);  // Use dynamic error message
            }

        } catch (error) {
            console.error("Error during signup:", error);
            this.onSubmitFailure('An unexpected error occurred.'); // General error message
        }
    }

    renderPasswordField = () => {
        const { password } = this.state;
        return (
            <>
                <label className='input-label' htmlFor='password'>PASSWORD</label>
                <div className='input-contain'>
                    <MdOutlineScreenLockPortrait className='icon' />
                    <input
                        type='password'
                        id='password'
                        className='input-field'
                        value={password}
                        onChange={this.onChangePassword}
                        placeholder='Create Password'
                        required
                    />
                </div>
            </>
        );
    }

    renderUsernameField = () => {
        const { username } = this.state;
        return (
            <>
                <label className='input-label' htmlFor='username'>USERNAME</label>
                <div className='input-contain'>
                    <IoMdContact className='icon' />
                    <input
                        type='text'
                        id='username'
                        className='input-field'
                        value={username}
                        onChange={this.onChangeUsername}
                        placeholder='Create Username'
                        required
                    />
                </div>
            </>
        );
    }

    renderEmailField = () => {
        const { email } = this.state;
        return (
            <>
                <label className='input-label' htmlFor='email'>Email</label>
                <div className='input-contain'>
                    <MdMarkEmailRead className='icon' />
                    <input
                        type='email' // Changed to email type
                        id='email'
                        className='input-field'
                        value={email}
                        onChange={this.onChangeEmail}
                        placeholder='Your e-mail'
                        required
                    />
                </div>
            </>
        );
    }

    render() {
        const { showSubmitError, errorMessage } = this.state;
        return (
            <div className='login-form-container'>
                <form className='form-container' onSubmit={this.onSubmitForm}>
                    <img src='https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7885.jpg'
                        className='login-website-logo-desktop-img image-logo'
                        alt='website logo'
                    />
                    <div className='card'>
                        <h1>Welcome!</h1>
                        <div className='input-container'>{this.renderUsernameField()}</div>
                        <div className='input-container'>{this.renderEmailField()}</div>
                        <div className='input-container'>{this.renderPasswordField()}</div>
                        <button className='signup-button' type='submit'>SignUp</button>
                        {showSubmitError && <p className='error' aria-live="assertive">{errorMessage}</p>} {/* Dynamic error message */}
                    </div>
                </form>
            </div>
        );
    }
}

export default Signup;
