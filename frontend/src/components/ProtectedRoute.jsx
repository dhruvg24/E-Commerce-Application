import React from 'react'
import { useSelector } from 'react-redux'
import LoadingContent from './LoadingContent';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({element, adminOnly=false}) {
    const {isAuthenticated, loading,user} = useSelector(state=>state.user);
    if(loading){
        return <LoadingContent />
    }
    if(!isAuthenticated){
        return <Navigate to='/login' />
    }

    if(adminOnly && user.role!=='admin'){
        // so that logged in user cant access dashboard.
        return <Navigate to='/'/>
    }
  return element
}

export default ProtectedRoute