import React from 'react';
import { useSelector } from 'react-redux';

const ResultsTable = () => {
    const history = useSelector((state) => state.points.history);

    const formatJavaDate = (dateArray) => {
        if (!Array.isArray(dateArray)) return dateArray;
        const [year, month, day, hour, minute, second] = dateArray;
        const pad = (num) => String(num).padStart(2, '0');
        return `${pad(day)}.${pad(month)}.${year} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
    };

    return (
        <div className="results-container">
            <table className="results-table">
                <thead>
                    <tr>
                        <th>X</th>
                        <th>Y</th>
                        <th>R</th>
                        <th>Результат</th>
                        <th>Время запроса</th>
                        <th>Время (мкс)</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((point, index) => (
                        <tr key={point.id || index}>
                            <td>{point.x}</td>
                            <td>{point.y}</td>
                            <td>{point.r}</td>
                            <td>
                                <span className={point.hit ? 'hit' : 'miss'}>
                                    {point.hit ? 'Попадание' : 'Промах'}
                                </span>
                            </td>
                            <td>{formatJavaDate(point.currentTime)}</td>
                            <td>{point.executionTime}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ResultsTable;