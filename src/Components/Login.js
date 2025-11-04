// Login.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

const API_BASE_URL = "http://127.0.0.1:5000";

export default function FormLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-senha').value.trim();
    
    if (!email || !password) {
        alert('Email e senha são obrigatórios!');
        return;
    }
    
    setLoading(true);
    const url = `${API_BASE_URL}/login`;
    
    const body = {
        email: email,
        password: password
    };
    
    try {
        const api = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        if (api.ok) {
            const data = await api.json();
            
            // Salva token e user_id no localStorage
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_id', data.user_id);
            
            alert('Login realizado com sucesso!');
            
            // Redireciona para página home após 1 segundo
            setTimeout(() => {
                navigate('/home');
            }, 1000);
        } else {
            const errorApi = await api.json();
            console.error("Erro no login:", errorApi);
            alert("Erro no login: " + (errorApi.erro || errorApi.message || "verifique os dados."));
        }
    } catch (err) {
        console.error("Falha na conexão:", err);
        alert("Erro ao conectar com o servidor.");
    } finally {
        setLoading(false);
    }
  }

  return (
    <div className="main-container">
      <div className="form-container">
        <form id="form-login" onSubmit={handleLogin}>
          <h2>Login</h2>

          <input 
            type="email" 
            placeholder="E-Mail" 
            required 
            id="login-email" 
            disabled={loading} 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            required 
            id="login-senha" 
            disabled={loading} 
          />
          
          <button type="submit" id="botao-login" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
          
          <Link to="/cadastro">Não tem conta? Cadastre-se</Link>
        </form>
      </div>
    </div>
  );
}

{/*import React from "react";
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
}*/}