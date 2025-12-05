import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, clearErrors } from '../redux/authSlice';

const LoginForm = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { status, error } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(clearErrors());
    }, [name, password, dispatch]);

    useEffect(() => {
        if (status === 'succeeded') {
            navigate('/main');
        }
    }, [status, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        if (name && password) dispatch(loginUser({ name, password }));
    };

    const handleRegister = (e) => {
        e.preventDefault();
        if (name && password) dispatch(registerUser({ name, password }));
    };

    return (
        <div className="left-column" style={{ width: '100%', maxWidth: '450px', margin: '0 auto', borderRight: 'none', boxShadow: 'none' }}>
            <div className="form-header">
                <h3>Вход и Регистрация</h3>
            </div>
            
            <form>
                <div className="input-field">
                    <label htmlFor="name">Имя пользователя:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите имя"
                    />
                </div>

                <div className="input-field">
                    <label htmlFor="password">Пароль:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Введите пароль"
                    />
                </div>

                {error && (
                    <div className="error-message">
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                    <button 
                        onClick={handleLogin}
                        className="submit-button"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? '...' : 'Войти'}
                    </button>

                    <button 
                        onClick={handleRegister}
                        className="submit-button"
                        disabled={status === 'loading'}
                    >
                        Регистрация
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;