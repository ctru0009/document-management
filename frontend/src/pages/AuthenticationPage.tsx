import { useState } from "react";
import Form from "../components/Form";
import NavigationBar from "../components/NavigationBar";
import { Helmet } from "react-helmet";

const AuthenticationPage = () => {
  const [isLoginView, setIsLoginView] = useState(true);

  const toggleView = () => {
    setIsLoginView(!isLoginView);
  };

  return (
    <>
      <Helmet>
        <title>Authentication</title>
      </Helmet>
      <NavigationBar />
      <div className="bg-gradient-to-r from-cyan-300 to-blue-200 min-h-screen flex flex-col items-center justify-center ">
        <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-lg rounded-lg">
          <h1 className="font-bold text-xl text-center">
            {isLoginView ? "Login to Your Account" : "Register New Account"}
          </h1>
          <Form
            route={isLoginView ? "api/v1.0/session" : "api/v1.0/user"}
            method={isLoginView ? "login" : "register"}
          />
          <button
            onClick={toggleView}
            className="mt-4 text-sm text-blue-500 hover:text-blue-700"
          >
            {isLoginView
              ? "Need an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </>
  );
};

export default AuthenticationPage;
