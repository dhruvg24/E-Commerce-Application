import React, { useState } from "react";
import "../CartStyles/Shipping.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CheckoutPath from "./CheckoutPath";
import { useDispatch, useSelector } from "react-redux";
import { Country, State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
import { saveShippingInfo } from "../features/cart/cartSlice";
const Shipping = () => {
  const { shippingInfo } = useSelector((state) => state.cart);
  // console.log(shippingInfo);
  // console.log(Country.getAllCountries());
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState(shippingInfo.address || '');
  const [pincode, setPincode] = useState(shippingInfo.pincode || '');
  const [contactnumber, setContactNumber] = useState(shippingInfo.contactnumber || '');
  const [country, setCountry] = useState(shippingInfo.country || '');
  const [state, setState] = useState(shippingInfo.state || '');
  const [city, setCity] = useState(shippingInfo.city || '');

  const shippingInfoSubmit = (e) => {
    e.preventDefault();
    if(contactnumber.length!=10){
      toast.error('Invalid phone number! It should be of 10 digits', {position:'top-center', autoClose:3000});

      return;

    }
    dispatch(saveShippingInfo({address,pincode,contactnumber,country,state,city}));

    navigate('/order/confirm')
  };

  return (
    <>
      <PageTitle title="Shipping Info" />
      <Navbar />
      <CheckoutPath activePath={0} />
      {/* through active path can know about the orders current status. */}
      <div className="shipping-form-container">
        <h1 className="shipping-form-header">Shipping Details</h1>

        <form className="shipping-form" onSubmit={shippingInfoSubmit}>
          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Enter your address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              ></input>
            </div>

            <div className="shipping-form-group">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="number"
                id="pincode"
                name="pincode"
                placeholder="Enter your Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
              ></input>
            </div>

            <div className="shipping-form-group">
              <label htmlFor="contactnumber">Contact Number</label>
              <input
                type="tel"
                id="contactnumber"
                name="contactnumber"
                placeholder="Enter your Contact Number"
                value={contactnumber}
                onChange={(e) => setContactNumber(e.target.value)}
              ></input>
            </div>
          </div>

          <div className="shipping-section">
            <div className="shipping-form-group">
              <label htmlFor="country">Country</label>
              <select
                name="country"
                id="country"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setState("");
                  setCity("");
                }}
              >
                <option value="">Select Country</option>

                {Country &&
                  Country.getAllCountries().map((item) => (
                    <option value={item.isoCode} key={item.isoCode}>
                      {item.name}
                    </option>
                  ))}
              </select>
            </div>

            {country && (
              <div className="shipping-form-group">
                <label htmlFor="state">State</label>
                <select
                  name="state"
                  id="state"
                  value={state}
                  onChange={(e) => {
                    setState(e.target.value);
                    setCity("");
                  }}
                >
                  <option value="">Select State</option>

                  {State &&
                    State.getStatesOfCountry(country).map((item) => (
                      <option value={item.isoCode} key={item.isoCode}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {state && (
              <div className="shipping-form-group">
                <label htmlFor="city">City</label>
                <select
                  name="city"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Select City</option>

                  {City &&
                    City.getCitiesOfState(country, state).map((item) => (
                      <option value={item.name} key={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>

          <button className="shipping-submit-btn">Continue</button>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default Shipping;
