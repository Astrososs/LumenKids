import { useSelector } from 'react-redux';
import DashboardView from '../views/pages/DashboardView';

export default function DashboardPresenter() {
    const { data: user } = useSelector((state) => state.user);
    
    return (
        <DashboardView 
            user={user} 
            missions={[]} 
        />
    );
}