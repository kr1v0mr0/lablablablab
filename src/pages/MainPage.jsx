import React from 'react';
import Header from '../components/Header';
import PointForm from '../components/PointForm';
import ResultsTable from '../components/ResultsTable';
import CanvasGraph from '../components/CanvasGraph';

const MainPage = () => {
    return (
        <div className="main-wrapper">
            <Header />
            <div className="container">
                <div className="left-column">
                    {/* Форма ввода (в ней вся логика кнопок и отправки) */}
                    <PointForm />
                    
                    {/* График */}
                    <div className="description">
                        <h3>Заданная область</h3>
                        <CanvasGraph />
                    </div>
                </div>

                <div className="right-column">
                    <div className="results-header">
                        <h3>История результатов</h3>
                    </div>
                    {/* Таблица результатов */}
                    <ResultsTable />
                </div>
            </div>
        </div>
    );
};

export default MainPage;