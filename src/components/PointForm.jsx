import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkPoint, setRadius } from '../redux/pointsSlice';

const PointForm = () => {
    const dispatch = useDispatch();
    // Достаем радиус и статус из Store
    const { r, status } = useSelector((state) => state.points);
    
    const [x, setX] = useState(0);
    const [y, setY] = useState('');
    const [localError, setLocalError] = useState('');

    const xValues = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
    const rValues = [1, 2, 3, 4, 5];

    const validateAndSubmit = (e) => {
        e.preventDefault();
        setLocalError('');

        // Заменяем запятую на точку (для удобства ввода)
        let yVal = parseFloat(y.replace(',', '.'));

        if (isNaN(yVal)) {
            setLocalError('Y должен быть числом');
            return;
        }

        if (yVal < -5 || yVal > 5) {
            setLocalError('Y должен быть в диапазоне от -5 до 5');
            return;
        }

        if (r <= 0) {
            setLocalError('Радиус должен быть положительным');
            return;
        }

        // Отправляем action в Redux
        dispatch(checkPoint({ x, y: yVal, r }));
    };

    return (
        <div className="point-form-wrapper">
            <div className="form-header">
                <h3>Ввод параметров</h3>
            </div>

            <form onSubmit={validateAndSubmit}>
                {/* Выбор X */}
                <div className="input-field">
                    <label>Координата X:</label>
                    <div className="x-buttons-container">
                        <div className="x-buttons">
                            {xValues.map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    className={`x-button ${x === val ? 'selected' : ''}`}
                                    onClick={() => setX(val)}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                    <span className="current-value">Выбрано X: {x}</span>
                </div>

                {/* Ввод Y (обычный input вместо Belle) */}
                <div className="input-field">
                    <label htmlFor="y-input">Координата Y [-5 ... 5]:</label>
                    <input 
                        id="y-input"
                        type="text"
                        value={y}
                        onChange={(e) => setY(e.target.value)}
                        placeholder="Введите число от -5 до 5"
                        style={{ 
                            width: '100%', 
                            padding: '12px',
                            border: '2px solid #bdc3c7',
                            borderRadius: '6px',
                            boxSizing: 'border-box',
                            textAlign: 'center',
                            fontSize: '15px'
                        }}
                    />
                </div>

                {/* Выбор R */}
                <div className="input-field">
                    <label>Радиус R:</label>
                    <div className="x-buttons-container">
                        <div className="x-buttons">
                            {rValues.map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    className={`x-button ${r === val ? 'selected' : ''}`}
                                    onClick={() => dispatch(setRadius(val))}
                                >
                                    {val}
                                </button>
                            ))}
                        </div>
                    </div>
                    <span className="current-value">Выбрано R: {r}</span>
                </div>

                {/* Ошибки */}
                {localError && (
                    <div className="error-message" style={{ textAlign: 'center' }}>
                        {localError}
                    </div>
                )}

                {/* Кнопка отправки */}
                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Проверка...' : 'Проверить попадание'}
                </button>
            </form>
        </div>
    );
};

export default PointForm;