import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { register, removeErrors, removeSuccess } from "../features/user/userSlice";
// import express from "express";
const Register = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("./images/profile.png");
  const { name, email, password } = user;

  const {success, loading, error} =  useSelector(state=>state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const registerDataChange = (e)=>{
    if(e.target.name==='avatar'){
        // if image is changed
        const reader=new FileReader();
        reader.onload=()=>{
            if(reader.readyState===2){
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        }
        reader.readAsDataURL(e.target.files[0]);

    }else{
        // if other fields are changed
        setUser({...user, [e.target.name]:e.target.value})
    }
  }

  const registerSubmit = (e)=>{
    e.preventDefault();
    if(!name || !email || !password){
        toast.error('Pls fill all the required fields!', {position: 'top-center', autoClose:3000});

        return;
        // dont proceed
    }
    const form = new FormData();
    form.set('name', name);
    form.set('email', email);
    form.set('password', password);
    form.set('avatar', avatar);

    for(let pair of form.entries()){
        console.log(pair[0] + '-'  + pair[1]);
    }

    dispatch(register(form));

  }

  useEffect(()=>{
    if(error){
        toast.error(error, {position: 'top-center', autoClose:3000});
        dispatch(removeErrors())
    }
  }, [dispatch, error])
  useEffect(()=>{
    if(success){
        toast.success('Registration successfull!', {position: 'top-center', autoClose:3000});
        dispatch(removeSuccess())
        navigate('/login')
    }
  }, [dispatch, success])
  return (
    <div className="form-container container">
      <div className="form-content">
        <form className="form" onSubmit={registerSubmit} encType="multipart/form-data">
          <h2>Sign Up</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              name="name"
              value={name}
              onChange={registerDataChange}
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={email}
              onChange={registerDataChange}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={registerDataChange}
            />
          </div>
          <div className="input-group avatar-group">
            <input
              type="file"
              name="avatar"
              className="file-input"
              accept="image/"
              onChange={registerDataChange}
            />
            <img src={avatarPreview} alt="Avatar Preview" className="avatar" />
          </div>
          <button className="authBtn">{loading?'Signing Up':'Sign Up'}</button>
          <p className="form-links">
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
