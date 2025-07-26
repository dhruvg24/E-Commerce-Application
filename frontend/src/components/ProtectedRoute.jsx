import React from 'react'
import { useSelector } from 'react-redux'
import LoadingContent from './LoadingContent';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({element}) {
    const {isAuthenticated, loading} = useSelector(state=>state.user);
    if(loading){
        return <LoadingContent />
    }
    if(!isAuthenticated){
        return <Navigate to='/login' />
    }
  return element
}

export default ProtectedRoute