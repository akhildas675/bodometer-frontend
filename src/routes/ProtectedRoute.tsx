import { Navigate, Outlet } from "react-router-dom";
import type { Role } from "../interface/userInterface";
import { useAuthStore } from "../stores/authStore";



interface Props{
    allowedRoles?:Role[];
}


const ProtectedRoute=({allowedRoles}:Props)=>{
    const {isAuthenticated,user}=useAuthStore();

    if(!isAuthenticated){
        return <Navigate to='/' replace/>;
    }

    if(allowedRoles && (!user || !allowedRoles.includes(user.role))) {
        return <Navigate to="/unauthorized" replace/>;
    }
    return <Outlet/>
}

export default ProtectedRoute