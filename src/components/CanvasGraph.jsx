import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// ИСПРАВЛЕНИЕ: Импортируем из pointsSlice, а не из actions
import { checkPoint } from '../redux/pointsSlice';

const CanvasGraph = () => {
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    // Берем текущий R и историю точек из Redux
    const { r, history } = useSelector(state => state.points);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2;
        const centerY = height / 2;
        const scale = 30;

        ctx.clearRect(0, 0, width, height);

        // --- Фигуры (Отрисовка области) ---
        ctx.fillStyle = 'rgba(84, 107, 81, 0.5)';
        ctx.strokeStyle = '#546B51';
        
        // Прямоугольник (2-я четверть: x<=0, y>=0 в мат. координатах)
        ctx.fillRect(centerX - (r/2) * scale, centerY - r * scale, (r/2) * scale, r * scale);

        // Треугольник (Ваш старый код рисовал его в 1-й четверти x>=0, y>=0)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX + (r/2) * scale, centerY);
        ctx.lineTo(centerX, centerY - r * scale);
        ctx.fill();

        // Сектор (Ваш старый код рисовал его в 4-й четверти x>=0, y<=0)
        ctx.beginPath();
        // arc(x, y, radius, startAngle, endAngle, counterclockwise)
        ctx.arc(centerX, centerY, r * scale / 2, 0, Math.PI / 2, false); 
        ctx.lineTo(centerX, centerY);
        ctx.fill();

        // --- Оси координат ---
        ctx.strokeStyle = "#2A3E33";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(width, centerY);
        ctx.moveTo(centerX, 0);
        ctx.lineTo(centerX, height);
        ctx.stroke();

        // --- Отрисовка точек из истории ---
        if (history && Array.isArray(history)) {
            history.forEach(point => {
                const ptX = centerX + point.x * scale;
                const ptY = centerY - point.y * scale;
                ctx.beginPath();
                ctx.arc(ptX, ptY, 5, 0, 2 * Math.PI);
                ctx.fillStyle = point.hit ? 'green' : 'red';
                ctx.fill();
                ctx.strokeStyle = point.hit ? 'darkgreen' : 'darkred';
                ctx.stroke();
            });
        }
    };

    // Перерисовываем, если изменился радиус или история точек
    useEffect(() => {
        draw();
    }, [r, history]); 

    const handleClick = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const scale = 30;

        let mathX = (clickX - centerX) / scale;
        let mathY = (centerY - clickY) / scale;

        // Валидация X (приводим к ближайшему разрешенному значению)
        const validX = [-2, -1.5, -1, -0.5, 0, 0.5, 1, 1.5, 2];
        const closestX = validX.reduce((prev, curr) => 
            Math.abs(curr - mathX) < Math.abs(prev - mathX) ? curr : prev
        );

        // Ограничение Y (-5 ... 5)
        if (mathY < -5) mathY = -5;
        if (mathY > 5) mathY = 5;
        
        // Диспатчим action (Redux сам отправит на сервер)
        dispatch(checkPoint({ x: closestX, y: parseFloat(mathY.toFixed(2)), r: r }));
    };

    return (
        <div className="canvas-container">
            <canvas 
                ref={canvasRef} 
                id="coordinate-plane" 
                width="400" 
                height="400" 
                onClick={handleClick}
                className="cat-cursor"
            />
        </div>
    );
};

export default CanvasGraph;