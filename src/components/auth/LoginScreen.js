import React, { useState } from "react";
import swal from "sweetalert";
import { Navigate, useNavigate } from "react-router-dom";

export const LoginScreen = () => {
  const [values, setValues] = useState({
    user: "",
    password: "",
  });

  const handleInputChange = ({ target }) => {
    setValues({
      ...values,
      [target.name]: target.value,
    });
  };

  const navigate = useNavigate();

  const { user, password } = values;

  const handleLogin = (e) => {
    e.preventDefault();
    if (user === "" || password === "") {
      swal({
        title: "Completá los datos",
        text: "Los campos no pueden estar vacíos",
        icon: "warning",
        button: "OK",
      });
      return; //Para que no pase de este punto el handler sin haber completado los 2 campos.
    }

    if (user !== "ensolvers-challenge" || password !== "123456") {
      swal({
        title: "Credenciales invalidas",
        text: "El campo user y/o password no son válidos.",
        icon: "warning",
        button: "OK",
      });
      return;
    }

    if (user === "ensolvers-challenge" && password === "123456") {
      swal({
        title: "Login exitoso",
        icon: "success",
        button: "OK",
      });
      localStorage.setItem("ensolverUser", { user, password });
      navigate("/mynotes");
      return;
    }
  };
  let ensolverUser = localStorage.getItem("ensolverUser");

  return (
    <>
      {ensolverUser ? <Navigate replace to="/mynotes" /> : null}
      <div className="row">
        <div className="col-6 offset-3">
          <h2>Login Form</h2>
          <form onSubmit={handleLogin}>
            <label className="form-label d-block mt-2">
              <span>User:</span>
              <br />
              <input
                type="text"
                placeholder="User"
                name="user"
                className="auth__input"
                autoComplete="off"
                value={user}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <label className="form-label d-block mt-2">
              <span>Password:</span>
              <br />
              <input
                type="password"
                placeholder="Password"
                name="password"
                className="auth__input"
                value={password}
                onChange={handleInputChange}
              />
            </label>
            <br />
            <button
              type="submit"
              className="btn mt-2 btn-outline-primary btn-block"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
