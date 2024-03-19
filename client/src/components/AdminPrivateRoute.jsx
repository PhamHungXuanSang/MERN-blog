import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminPrivateRoute() {
    const { currentUser } = useSelector((state) => state.user);
    return currentUser.isAdmin ? <Outlet /> : <Navigate to="/" />; // Outlet sẽ đi tới thằng con của PrivateRoute
}
