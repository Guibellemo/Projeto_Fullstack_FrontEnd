import React, { useState } from 'react';
import './styles.css';

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  
  function handleEdit() {
    setIsEditing(true);
  }
  
  function handleSave() {
    setIsEditing(false);
    alert("Dados salvos com sucesso!");
  }
  
  function handleDelete() {
    if (window.confirm("Tem certeza que deseja deletar sua conta?")) {
      alert("Conta deletada!");
    }
  }
  
  function handleLogout() {
    if (window.confirm("Deseja sair?")) {
      alert("Logout realizado!");
      // window.location.href = "/login";
    }
  }

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <div className="welcome-section">
          <h2>Bem-vindo, <span id="nome-titulo">[Nome]</span>!</h2>
          <p>Email: <span id="email-titulo">[e-mail]</span></p>
        </div>

        <div className="data-section">
          <form id="form-cadastro">
            <h3>Seus dados</h3>
            <input 
              type="text" 
              placeholder="Nome" 
              required 
              id="home-cadastro-nome" 
              disabled={!isEditing}
            />
            <input 
              type="email" 
              placeholder="E-Mail" 
              required 
              id="home-cadastro-email" 
              disabled={!isEditing}
            />
            <input 
              type="password" 
              placeholder="Senha" 
              id="home-cadastro-senha" 
              disabled={!isEditing}
            />
            <input 
              type="tel" 
              placeholder="Celular" 
              id="home-cadastro-phone" 
              disabled={!isEditing}
            />
            <input 
              type="text" 
              placeholder="CPF/CNPJ" 
              id="home-cadastro-documento" 
              disabled={!isEditing}
            />
            
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {!isEditing ? (
                <button type="button" id="home-botao-editar" onClick={handleEdit}>
                  Editar ✏️
                </button>
              ) : (
                <button type="button" id="home-botao-salvar" onClick={handleSave}>
                  Salvar 💾
                </button>
              )}
              <button type="button" id="home-botao-deletar" onClick={handleDelete}>
                Deletar conta ❌
              </button>
              <button type="button" id="home-botao-logout" onClick={handleLogout}>
                Logout 🏃‍♂️
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}