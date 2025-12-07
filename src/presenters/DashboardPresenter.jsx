import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import DashboardView from '../views/pages/DashboardView';

export default function DashboardPresenter() {
    const dispatch = useDispatch();


    const { data: user } = useSelector((state) => state.user);
    

    const missions = []; 


    return (
        <DashboardView 
            user={user} 
            missions={missions} 
        />
    );
}