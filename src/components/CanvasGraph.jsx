import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkPoint, fetchTilePoints } from '../redux/pointsSlice';

const TILE_SIZE = 5;

const CanvasGraph = () => {
    const canvasRef = useRef(null);
    const dispatch = useDispatch();
    const { r, history, tileCache } = useSelector(state => state.points);

    const [viewport, setViewport] = useState({
        x: 0, y: 0, zoom: 1.0
    });

    const [filterMode, setFilterMode] = useState('last'); 

    const [isDragging, setIsDragging] = useState(false);
    const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

    const BASE_SCALE = 30; 

    const updateTiles = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const currentScale = BASE_SCALE * viewport.zoom;
        const width = canvas.width;
        const height = canvas.height;
        const centerX = width / 2 + viewport.x;
        const centerY = height / 2 + viewport.y;

        const minVisX = (0 - centerX) / currentScale;
        const maxVisX = (width - centerX) / currentScale;
        const minVisY = -(height - centerY) / currentScale; 
        const maxVisY = -(0 - centerY) / currentScale;

        const startTileX = Math.floor(minVisX / TILE_SIZE);
        const endTileX = Math.floor(maxVisX / TILE_SIZE);
        const startTileY = Math.floor(minVisY / TILE_SIZE);
        const endTileY = Math.floor(maxVisY / TILE_SIZE);

        for (let tx = startTileX; tx <= endTileX; tx++) {
            for (let ty = startTileY; ty <= endTileY; ty++) {
                const tileKey = `${tx}_${ty}`;
                if (!tileCache || !tileCache[tileKey]) {
                    const minX = tx * TILE_SIZE;
                    const maxX = (tx + 1) * TILE_SIZE;
                    const minY = ty * TILE_SIZE;
                    const maxY = (ty + 1) * TILE_SIZE;
                    dispatch(fetchTilePoints({ minX, minY, maxX, maxY, tileKey }));
                }
            }
        }
    };

    useEffect(() => {
        const timeout = setTimeout(updateTiles, 200);
        return () => clearTimeout(timeout);
    }, [viewport, tileCache]);


    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;
        
        const currentScale = BASE_SCALE * viewport.zoom;
        const centerX = width / 2 + viewport.x;
        const centerY = height / 2 + viewport.y;

        ctx.clearRect(0, 0, width, height);

        const toPx = (x, y) => ({
            x: centerX + x * currentScale,
            y: centerY - y * currentScale
        });

        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;
        const minVisX = Math.floor((0 - centerX) / currentScale);
        const maxVisX = Math.ceil((width - centerX) / currentScale);
        const minVisY = Math.floor(-(height - centerY) / currentScale);
        const maxVisY = Math.ceil(-(0 - centerY) / currentScale);

        ctx.beginPath();
        for (let i = minVisX; i <= maxVisX; i++) {
            const p = toPx(i, 0);
            ctx.moveTo(p.x, 0);
            ctx.lineTo(p.x, height);
        }
        for (let i = minVisY; i <= maxVisY; i++) {
            const p = toPx(0, i);
            ctx.moveTo(0, p.y);
            ctx.lineTo(width, p.y);
        }
        ctx.stroke();

        ctx.fillStyle = 'rgba(84, 107, 81, 0.5)';
        ctx.strokeStyle = '#546B51';
        
        if (r > 0) {
            const pRect = toPx(-r/2, r); 
            const rectW = (r/2) * currentScale;
            const rectH = r * currentScale;
            ctx.fillRect(pRect.x, pRect.y, rectW, rectH);

            ctx.beginPath();
            ctx.moveTo(toPx(0,0).x, toPx(0,0).y);
            ctx.lineTo(toPx(r/2, 0).x, toPx(r/2, 0).y);
            ctx.lineTo(toPx(0, r).x, toPx(0, r).y);
            ctx.fill();

            ctx.beginPath();
            const p00 = toPx(0,0);
            ctx.moveTo(p00.x, p00.y);
            ctx.arc(p00.x, p00.y, r * currentScale / 2, 0, Math.PI / 2, false);
            ctx.fill();
        }

        ctx.strokeStyle = "#2A3E33";
        ctx.lineWidth = 2;
        ctx.fillStyle = "#2A3E33";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const origin = toPx(0, 0);

        ctx.beginPath();
        ctx.moveTo(0, origin.y);
        ctx.lineTo(width, origin.y);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(origin.x, 0);
        ctx.lineTo(origin.x, height);
        ctx.stroke();

        ctx.fillStyle = '#2A3E33';
        ctx.beginPath();
        ctx.moveTo(width - 10, origin.y - 5);
        ctx.lineTo(width, origin.y);
        ctx.lineTo(width - 10, origin.y + 5);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(origin.x - 5, 10);
        ctx.lineTo(origin.x, 0);
        ctx.lineTo(origin.x + 5, 10);
        ctx.fill();

        ctx.fillText("x", width - 15, origin.y - 15);
        ctx.fillText("y", origin.x + 15, 15);

        ctx.lineWidth = 1;
        ctx.strokeStyle = "#2A3E33";

        for (let i = minVisX; i <= maxVisX; i++) {
            if (i === 0) continue; 
            const p = toPx(i, 0);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y - 5);
            ctx.lineTo(p.x, p.y + 5);
            ctx.stroke();
            ctx.fillText(i.toString(), p.x, p.y + 15);
        }

        for (let i = minVisY; i <= maxVisY; i++) {
            if (i === 0) continue;
            const p = toPx(0, i);
            ctx.beginPath();
            ctx.moveTo(p.x - 5, p.y);
            ctx.lineTo(p.x + 5, p.y);
            ctx.stroke();
            ctx.fillText(i.toString(), p.x - 15, p.y);
        }

        if (history && Array.isArray(history)) {
            
            const pointsByRadius = history.filter(p => Number(p.r) === Number(r));

            let pointsToDraw = [];

            switch (filterMode) {
                case 'last':
                    if (pointsByRadius.length > 0) pointsToDraw = [pointsByRadius[0]];
                    break;
                case 'hit':
                    pointsToDraw = pointsByRadius.filter(p => p.hit);
                    break;
                case 'miss':
                    pointsToDraw = pointsByRadius.filter(p => !p.hit);
                    break;
                case 'all':
                default:
                    pointsToDraw = pointsByRadius;
                    break;
            }

            pointsToDraw.forEach(point => {
                const pt = toPx(point.x, point.y);
                if (pt.x < -10 || pt.x > width + 10 || pt.y < -10 || pt.y > height + 10) return;

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, 5, 0, 2 * Math.PI);
                ctx.fillStyle = point.hit ? '#2E8B57' : '#B22222';
                ctx.fill();
            });
        }
    };

    useEffect(() => {
        let animationId;
        const render = () => {
            draw();
            animationId = requestAnimationFrame(render);
        };
        render();
        return () => cancelAnimationFrame(animationId);
    }, [r, history, viewport, filterMode]);


    const handleWheel = (e) => {
        e.preventDefault();
        const zoomSensitivity = 0.001;
        const delta = -e.deltaY * zoomSensitivity;
        
        setViewport(prev => {
            const newZoom = Math.min(Math.max(prev.zoom + delta, 0.5), 5.0);
            return { ...prev, zoom: newZoom };
        });
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        
        setViewport(prev => ({
            ...prev,
            x: prev.x + dx,
            y: prev.y + dy
        }));
        setLastPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => setIsDragging(false);

    const handleClick = (e) => {
        if (isDragging) return; 

        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        
        const clickPxX = e.clientX - rect.left;
        const clickPxY = e.clientY - rect.top;

        const currentScale = BASE_SCALE * viewport.zoom;
        const centerX = canvas.width / 2 + viewport.x;
        const centerY = canvas.height / 2 + viewport.y;

        const mathX = (clickPxX - centerX) / currentScale;
        const mathY = (centerY - clickPxY) / currentScale;

        dispatch(checkPoint({ 
            x: parseFloat(mathX.toFixed(4)), 
            y: parseFloat(mathY.toFixed(4)), 
            r: r 
        }));
    };

    return (
        <div className="canvas-container" style={{display: 'block'}}>
            <canvas 
                ref={canvasRef} 
                id="coordinate-plane" 
                width="400" 
                height="400" 
                className="cat-cursor"
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onClick={handleClick}
            />
            
            <div className="filter-container">
                <button 
                    className={`filter-btn ${filterMode === 'last' ? 'active' : ''}`}
                    onClick={() => setFilterMode('last')}
                >
                    Последняя
                </button>
                <button 
                    className={`filter-btn ${filterMode === 'hit' ? 'active' : ''}`}
                    onClick={() => setFilterMode('hit')}
                >
                    Попадания
                </button>
                <button 
                    className={`filter-btn ${filterMode === 'miss' ? 'active' : ''}`}
                    onClick={() => setFilterMode('miss')}
                >
                    Промахи
                </button>
                <button 
                    className={`filter-btn ${filterMode === 'all' ? 'active' : ''}`}
                    onClick={() => setFilterMode('all')}
                >
                    Все
                </button>
            </div>

            <div style={{fontSize: '12px', color: '#666', marginTop: '5px', textAlign: 'center'}}>
                Колесико - зум, ПКМ - перемещение, Клик - выстрел
            </div>
        </div>
    );
};

export default CanvasGraph;