import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function UserProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    cnpj: ''
  });

  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  function getToken() {
    return localStorage.getItem('access_token');
  }

  function getUserId() {
    return localStorage.getItem('user_id');
  }

  function removeToken() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
  }

  async function carregarDadosUsuario() {
    const userId = getUserId();
    const token = getToken();
    
    if (!userId || !token) {
      alert('Sessão expirada. Faça login novamente.');
      navigate('/');
      return;
    }
    
    const url = `${API_BASE_URL}/user/${userId}`;
    
    try {
      const api = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (!api.ok) {
        const errorApi = await api.json();
        console.error("Erro ao carregar dados:", errorApi);
        alert("Erro ao carregar dados: " + (errorApi.erro || errorApi.message || "tente novamente."));
        
        if (api.status === 401 || api.status === 403) {
          removeToken();
          navigate('/');
        }
        return;
      }
      
      const user = await api.json();
      console.log('Dados recebidos da API:', user);
      
      setUserData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        phone: user.phone || '',
        cnpj: user.cnpj || ''
      });
      
      console.log('Todos os dados carregados com sucesso!');
      
    } catch (error) {
      console.error("Falha na conexão:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleChange(e) {
    const { id, value } = e.target;
    const field = id.replace('home-cadastro-', '');
    
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  }

  async function handleSave() {
    const userId = getUserId();
    const token = getToken();
    
    if (!userId || !token) {
      alert('Sessão expirada. Faça login novamente.');
      navigate('/');
      return;
    }
    
    const { name, email, password, phone, cnpj } = userData;
    
    if (!name || !email) {
      alert('Nome e email são obrigatórios!');
      return;
    }
    
    setLoading(true);
    const url = `${API_BASE_URL}/user/${userId}`;
    
    const body = {
      name: name,
      email: email,
      phone: phone,
      cnpj: cnpj
    };
    
    if (password.trim()) {
      body.password = password;
    }
    
    try {
      const api = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      if (api.ok) {
        const data = await api.json();
        console.log("Atualizado com sucesso:", data);
        alert("Dados atualizados com sucesso!");
        
        setIsEditing(false);
        setUserData(prev => ({ ...prev, password: '' }));
        carregarDadosUsuario();
      } else {
        const errorApi = await api.json();
        console.error("Erro ao atualizar:", errorApi);
        alert("Erro na atualização: " + (errorApi.erro || errorApi.message || "verifique os dados."));
      }
    } catch (err) {
      console.error("Falha na conexão:", err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Tem certeza que deseja deletar sua conta? Esta ação não pode ser desfeita!')) {
      return;
    }
    
    const userId = getUserId();
    const token = getToken();
    
    if (!userId || !token) {
      alert('Sessão expirada. Faça login novamente.');
      navigate('/');
      return;
    }
    
    setLoading(true);
    const url = `${API_BASE_URL}/user/${userId}`;
    
    try {
      const api = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      
      if (api.ok) {
        alert("Conta deletada com sucesso!");
        removeToken();
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        const errorApi = await api.json();
        console.error("Erro ao deletar:", errorApi);
        alert("Erro ao deletar conta: " + (errorApi.erro || errorApi.message || "tente novamente."));
      }
    } catch (err) {
      console.error("Falha na conexão:", err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    if (window.confirm("Deseja sair?")) {
      removeToken();
      
      setTimeout(() => {
        navigate('/');
      }, 1000);
    }
  }

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <div className="welcome-section">
          <h2>Bem-vindo, <span id="nome-titulo">{userData.name || '[Nome]'}</span>!</h2>
          <p>Email: <span id="email-titulo">{userData.email || '[e-mail]'}</span></p>
        </div>

        <div className="data-section">
          <form id="form-cadastro">
            <h3>Seus dados</h3>
            <input 
              type="text" 
              placeholder="Nome" 
              required 
              id="home-cadastro-name" 
              value={userData.name}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <input 
              type="email" 
              placeholder="E-Mail" 
              required 
              id="home-cadastro-email" 
              value={userData.email}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <input 
              type="password" 
              placeholder="Senha (deixe em branco para não alterar)" 
              id="home-cadastro-password" 
              value={userData.password}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <input 
              type="tel" 
              placeholder="Celular" 
              id="home-cadastro-phone" 
              value={userData.phone}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <input 
              type="text" 
              placeholder="CPF/CNPJ" 
              id="home-cadastro-cnpj" 
              value={userData.cnpj}
              onChange={handleChange}
              disabled={!isEditing}
            />
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {!isEditing ? (
                <button 
                  type="button" 
                  id="home-botao-editar" 
                  onClick={handleEdit}
                  disabled={loading}
                >
                  Editar
                </button>
              ) : (
                <button 
                  type="button" 
                  id="home-botao-salvar" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              )}
              <button 
                type="button" 
                id="home-botao-deletar" 
                onClick={handleDelete}
                disabled={loading}
              >
                Deletar conta
              </button>
              <button 
                type="button" 
                id="home-botao-logout" 
                onClick={handleLogout}
                disabled={loading}
              >
                Logout
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
