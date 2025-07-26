import React, { useEffect, useState } from 'react'
import '../UserStyles/Form.css'
import PageTitle from '../components/PageTitle'
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeErrors, removeSuccess, resetPassword } from '../features/user/userSlice';
import { toast } from 'react-toastify';
const ResetPassword = () => {
    const {success, loading, error} = useSelector(state=>state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {token} = useParams()
    // through this we will be able to get user id
    const resetPasswordSubmit = (e)=>{
        e.preventDefault();
        const data = {
            password, 
            confirmPassword
        }
        dispatch(resetPassword({token, userData:data}))
    }

    useEffect(() => {
        if (error) {
          toast.error(error, { position: "top-center", autoClose: 3000 });
          dispatch(removeErrors());
        }
      }, [dispatch, error]);
    
      useEffect(() => {
        if (success) {
          toast.success('Password Reset Successfully', {
            position: "top-center",
            autoClose: 3000,
          });
          dispatch(removeSuccess());
          navigate('/login')
        }
      }, [dispatch, success]);
  return (
    <>
    <PageTitle title="Reset Password"/>
    <div className='container form-container'>
        <div className="form-content">
          <form
            className="form"
            
            onSubmit={resetPasswordSubmit}
          >
            <h2>Reset Password</h2>
            
           
            <div className="input-group">
              <input
                type="password"
                value={password}
                name="password"
                placeholder='Enter your new Password'
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>
            <div className="input-group">
              <input
                type="password"
                value={confirmPassword}
                name="confirmPassword"
                placeholder='Confirm Password'
                onChange={(e)=>setConfirmPassword(e.target.value)}
              />
            </div>
            
        
            <button className="authBtn">Reset Password</button>
          </form>
        </div>
    </div>
    </>
  )
}

export default ResetPassword