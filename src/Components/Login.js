import React from "react";
import { Link } from "react-router-dom";
import "./styles.css";

export default function FormLogin() {

  function handleLogin(e) {
    e.preventDefault();
    alert("Login realizado!");
  }

  return (
    <div className="main-container">
      <div className="form-container">
        <form id="form-login" onSubmit={handleLogin}>
          <h2>Login</h2>
          <input type="email" placeholder="E-Mail" required id="login-email" />
          <input type="password" placeholder="Senha" required id="login-senha" />
          <button type="submit" id="botao-login">Entrar</button>
          <Link to="/cadastro">Não tem conta? Cadastre-se</Link>
        </form>
      </div>
    </div>
  );
}