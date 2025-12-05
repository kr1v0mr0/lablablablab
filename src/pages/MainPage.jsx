import React, { useEffect } from 'react'; 
import { useDispatch } from 'react-redux'; 
import { fetchPoints } from '../redux/pointsSlice'; 
import Header from '../components/Header';
import PointForm from '../components/PointForm';
import ResultsTable from '../components/ResultsTable';
import CanvasGraph from '../components/CanvasGraph';

const MainPage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPoints());
    }, [dispatch]);

    return (
        <div className="main-wrapper">
            <Header />
            <div className="container">
                <div className="left-column">
                    <PointForm />
                    
                    <div className="description">
                        <h3>Заданная область</h3>
                        <CanvasGraph />
                    </div>
                </div>

                <div className="right-column">
                    <div className="results-header">
                        <h3>История результатов</h3>
                    </div>
                    <ResultsTable />
                </div>
            </div>
        </div>
    );
};

export default MainPage;