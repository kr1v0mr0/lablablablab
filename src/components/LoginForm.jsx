import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser, clearErrors } from '../redux/authSlice';

const LoginForm = () => {
    // Изменили название стейта на name
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
                        style={{ width: '100%', padding: '12px', border: '2px solid #bdc3c7', borderRadius: '6px', marginTop: '6px' }}
                    />
                </div>

                {error && (
                    <div className="error-message" style={{ textAlign: 'center', marginBottom: '15px' }}>
                        {typeof error === 'object' ? JSON.stringify(error) : error}
                    </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button 
                        onClick={handleLogin}
                        className="submit-button"
                        disabled={status === 'loading'}
                        style={{ marginTop: 0 }}
                    >
                        {status === 'loading' ? '...' : 'Войти'}
                    </button>

                    <button 
                        onClick={handleRegister}
                        className="submit-button"
                        disabled={status === 'loading'}
                        style={{ marginTop: 0, background: 'linear-gradient(0deg, #764ba2, #667eea)' }}
                    >
                        Регистрация
                    </button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;