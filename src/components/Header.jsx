import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import kozaImg from '../assets/picturekoza.png';

const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <header>
            <div className="header-container">
                <div className="header-text">
                    <h1>Проверка попадания точки в область</h1>
                    <h2>Студент: Крылова Мария Дмитриевна | Группа: P3209 | Вариант: 547</h2>
                    <div className="header-navigation">
                        {location.pathname === '/main' && (
                            <button onClick={handleLogout} className="nav-link">
                                Выйти
                            </button>
                        )}
                    </div>
                </div>
                <img src={kozaImg} className="header-image" alt="Avatar" />
            </div>
        </header>
    );
};

export default Header;