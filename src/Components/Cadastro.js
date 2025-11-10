// Cadastro.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function FormCadastro() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleCadastro(e) {
    e.preventDefault();

    const name = document.getElementById("cadastro-nome").value.trim();
    const email = document.getElementById("cadastro-email").value.trim();
    const password = document.getElementById("cadastro-senha").value.trim();
    const phone = document.getElementById("cadastro-phone").value.trim();
    const cnpj = document.getElementById("cadastro-documento").value.trim();

    if (!name || !email || !password || !phone || !cnpj) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    const url = `${API_BASE_URL}/user`;

    const body = {
      name: name,
      cnpj: cnpj,
      email: email,
      phone: phone,
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
        console.log("Resposta API:", data);

        const userId =
          data.user_id ||
          (data.usuario && data.usuario.id) ||
          (data.user && data.user.id);

        if (userId) {
          localStorage.setItem("user_id", userId);
          console.log("ID salvo no localStorage:", userId);
        } else {
          console.warn("Nenhum ID retornado pela API:", data);
        }

        alert("Cadastro realizado com sucesso!");
        setTimeout(() => {
          navigate("/ativacao");
        }, 1000);
      
      } else {
        const errorApi = await api.json();
        console.error("Erro na API:", errorApi);
        alert("Erro no cadastro: " + (errorApi.erro || errorApi.message || "verifique os dados."));
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
        <form id="form-cadastro" onSubmit={handleCadastro}>
          <h2>Faça seu cadastro</h2>

          <input
            type="text"
            placeholder="Nome"
            required
            id="cadastro-nome"
            disabled={loading}
          />
          <input
            type="email"
            placeholder="E-Mail"
            required
            id="cadastro-email"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Senha"
            required
            id="cadastro-senha"
            disabled={loading}
          />
          <input
            type="tel"
            placeholder="Celular"
            required
            id="cadastro-phone"
            disabled={loading}
          />
          <input
            type="text"
            placeholder="CPF/CNPJ"
            required
            id="cadastro-documento"
            disabled={loading}
          />

          <button type="submit" id="botao-criar-conta" disabled={loading}>
            {loading ? "Cadastrando..." : "Criar Conta"}
          </button>

          <Link to="/">Já tem conta? Faça login</Link>
        </form>
      </div>
    </div>
  );
}
