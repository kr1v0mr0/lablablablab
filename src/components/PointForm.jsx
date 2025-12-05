import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkPoint, setRadius } from '../redux/pointsSlice';

const PointForm = () => {
    const dispatch = useDispatch();
    const { r, status } = useSelector((state) => state.points);
    
    const [x, setX] = useState(0);
    const [y, setY] = useState('');
    const [localError, setLocalError] = useState('');

    const xValues = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
    const rValues = [0, 1, 2, 3, 4, 5];

    const validateAndSubmit = (e) => {
        e.preventDefault();
        setLocalError('');

        let yVal = parseFloat(y.replace(',', '.'));

        if (isNaN(yVal)) {
            setLocalError('Y должен быть числом');
            return;
        }

        if (yVal < -5 || yVal > 5) {
            setLocalError('Y должен быть в диапазоне от -5 до 5');
            return;
        }

        if (r < 0) {
            setLocalError('Радиус не может быть отрицательным');
            return;
        }

        dispatch(checkPoint({ x, y: yVal, r }));
    };

    return (
        <div className="point-form-wrapper">
            <div className="form-header">
                <h3>Ввод параметров</h3>
            </div>

            <form onSubmit={validateAndSubmit}>
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

                <div className="input-field">
                    <label htmlFor="y-input">Координата Y [-5 ... 5]:</label>
                    <input 
                        id="y-input"
                        type="text"
                        value={y}
                        onChange={(e) => setY(e.target.value)}
                        placeholder="Введите число от -5 до 5"
                    />
                </div>

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

                {localError && (
                    <div className="error-message">
                        {localError}
                    </div>
                )}

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