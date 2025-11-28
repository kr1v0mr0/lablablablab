export const VALID_X = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
export const VALID_R = [1, 2, 3, 4, 5];

export const validateCoordinates = (x, y, r) => {
    if (!VALID_X.includes(x)) {
        return { valid: false, message: 'Выберите корректное значение X' };
    }

    const yVal = parseFloat(y);
    if (isNaN(yVal)) {
        return { valid: false, message: 'Y должен быть числом' };
    }
    if (yVal < -5 || yVal > 5) {
        return { valid: false, message: 'Y должен быть в диапазоне от -5 до 5' };
    }

    if (!VALID_R.includes(r)) {
        return { valid: false, message: 'Выберите корректный радиус' };
    }

    return { valid: true, message: '' };
};

export const normalizeX = (val) => {
    return VALID_X.reduce((prev, curr) => 
        Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );
};