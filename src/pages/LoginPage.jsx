import React from 'react';
import Header from '../components/Header';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
    return (
        <div className="main-wrapper">
            <Header />
            <div className="container" style={{ justifyContent: 'center', minHeight: 'auto', padding: '40px 0' }}>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;