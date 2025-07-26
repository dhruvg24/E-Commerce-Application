import React, { useEffect, useState } from "react";
import "../UserStyles/Form.css";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, removeErrors, removeSuccess } from "../features/user/userSlice";
import { toast } from "react-toastify";
import LoadingContent from "../components/LoadingContent";
const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const { loading, error, success, message } = useSelector(
    (state) => state.user
  );


  const dispatch = useDispatch();
  const forgotPasswordSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
    setEmail('');
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
    }
  }, [dispatch, success]);
  return (
    <>
    {loading?(<LoadingContent />):(<>
      <PageTitle title="Forgot Password" />
      <Navbar />
      <div className="container forgot-container">
        <div className="form-content email-group">
          <form className="form" onSubmit={forgotPasswordSubmit}>
            <h2>Forgot Password</h2>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your registered email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button className="authBtn">Send</button>
          </form>
        </div>
      </div>
      <Footer />
    </>)}
    </>
  );
  
};

export default ForgotPassword;
