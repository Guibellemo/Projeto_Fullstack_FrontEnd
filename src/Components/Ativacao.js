// Ativacao.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./styles.css";

const API_BASE_URL = URL_RENDER;

export default function FormAtivacao() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleAtivacao(e) {
    e.preventDefault();

    const email = document.getElementById("cadastro-email").value.trim();
    const code = document.getElementById("cadastro-codigo").value.trim();
    const userId = localStorage.getItem("user_id"); // ✅ obtém o ID salvo no cadastro

    if (!email || !code) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    if (!userId) {
      alert("Usuário não encontrado. Faça o cadastro novamente.");
      return;
    }

    setLoading(true);

    const url = `${API_BASE_URL}/activate/${userId}`;
    const body = { email, code };

    try {
      const api = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });

      const data = await api.json();

      if (api.ok) {
        console.log("Resposta API:", data);
        alert("Usuário ativado com sucesso!");


        localStorage.removeItem("user_id");


        setTimeout(() => {
          navigate("/");
        }, 1000);

      } else {
        console.error("Erro na ativação:", data);
        alert("Erro na ativação: " + (data.erro || data.message || "verifique os dados."));
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
        <form id="form-ativacao" onSubmit={handleAtivacao}>
          <h2>Ative sua conta</h2>

          <input
            type="email"
            placeholder="E-Mail cadastrado"
            required
            id="cadastro-email"
            disabled={loading}
          />

          <input
            type="text"
            placeholder="Código de ativação"
            required
            id="cadastro-codigo"
            maxLength="6"
            disabled={loading}
          />

          <button type="submit" id="botao-ativar-conta" disabled={loading}>
            {loading ? "Ativando..." : "Ativar Conta"}
          </button>

          <Link to="/">Voltar ao login</Link>
        </form>
      </div>
    </div>
  );
}



{/*import './styles.css';
import { Link } from "react-router-dom";

export default function FormAtivacao() {

  function handleAtivacao(e) {
    e.preventDefault();
    alert("Código validado com sucesso!");
  }

  return (
    <div className="main-container">
      <div className="form-container">
        <form id="form-cadastro" onSubmit={handleAtivacao}>
          <h2>Digite o código recebido</h2>
          <input 
            type="text" 
            placeholder="Código" 
            required 
            id="cadastro-codigo"
            maxLength="6"
          />
          <button type="submit" id="botao-ativar-conta">Ativar Conta</button>
          
        </form>
      </div>
    </div>
  );
}*/}