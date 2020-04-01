import React, { useState, useContext } from "react";
import "./App.css";

import { Switch, Route, Redirect } from "react-router-dom";

//import main component
import Header from "./components/Header";
import Footer from "./components/Footer";
import LogIn from "./components/LogIn";
import ResetPassword from "./components/ProtectionForm";

//import Pages
import LandingApp from "./pages/landingApp";
import SignUp from "./pages/signUp";
import ProductPage from "./pages/productPage";
import ProductDetail from "./pages/productDetail";
import Carts from "./pages/carts";
import Profile from "./pages/profileMenu";
import AddProduct from "./pages/addProduct";
import StorePage from "./pages/storePage";
import PowerStore from "./pages/powerStore";
import CartPayment from "./pages/cartPayment";

//admin component
import AdminDashboard from "./pages/adminDashboard";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { authContext } from "./contexts/Auth";

import PrivateRoute from "./components/PrivateRoutes";

import notFound from "./img/404.png";

const stripePromise = loadStripe("pk_test_AtlHscRyVkd8ifMfwTytBMfc00e4hmgMWA");

function App() {
  const [isPop, setIsPop] = useState(false);
  const { isLogIn, user } = useContext(authContext);

  const openLogin = () => {
    console.log(isLogIn);
    if (!localStorage.getItem("logIn")) {
      setIsPop(true);
    }
  };

  let userCheck = user ? user.role !== "admin" : true;

  const closeLogin = () => {
    setIsPop(false);
  };

  console.log(userCheck);

  return window.location.pathname.search("/admin") && userCheck ? (
    <>
      <Header openLogin={openLogin} />
      {isPop && <LogIn closeLogin={closeLogin} />}
      <Switch>
        <Route exact path="/">
          <LandingApp />
        </Route>
        <Route exact path="/reset/:token">
          <div className="reset-password">
            <ResetPassword />
          </div>
        </Route>
        <Route exact path="/signup">
          <SignUp closeLogin={closeLogin} />
        </Route>
        <Route exact path="/product-page/:param">
          <ProductPage />
        </Route>
        <Route exact path="/product/:id">
          <ProductDetail />
        </Route>
        <Route exact>
          <div className="not--found">
            <img src={notFound} />
          </div>
        </Route>
        <PrivateRoute exact path="/carts" openLogin={openLogin}>
          <Carts />
        </PrivateRoute>
        <PrivateRoute exact path="/profile" openLogin={openLogin}>
          <Profile />
        </PrivateRoute>
        <PrivateRoute exact path="/add-product" openLogin={openLogin}>
          <AddProduct />
        </PrivateRoute>
        <PrivateRoute exact path="/edit-product/:id" openLogin={openLogin}>
          <AddProduct />
        </PrivateRoute>
        <Route path="/store/:name">
          <StorePage />
        </Route>
        <PrivateRoute exact path="/power-store/page" openLogin={openLogin}>
          <PowerStore />
        </PrivateRoute>
        <Elements stripe={stripePromise}>
          <PrivateRoute exact path="/carts/payment" openLogin={openLogin}>
            <CartPayment />
          </PrivateRoute>
        </Elements>
      </Switch>
      <Footer />
    </>
  ) : (
    <Switch>
      <Route exact path="/admin/">
        <LogIn role="admin" />
      </Route>
      <Route exact path="/admin/dashboard">
        {!userCheck && user ? <AdminDashboard /> : <Redirect to="/admin" />}
      </Route>
    </Switch>
  );
}

export default App;
