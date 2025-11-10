// Vender-produto.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function VenderProduto() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quantidadesVenda, setQuantidadesVenda] = useState({});

  useEffect(() => {
    carregarProdutos();
  }, []);

  function getToken() {
    return localStorage.getItem("access_token");
  }

  function getUserId() {
    return localStorage.getItem("user_id");
  }

  async function carregarProdutos() {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      alert("Sessão expirada ou usuário não encontrado. Faça login novamente.");
      navigate("/");
      return;
    }

    setLoading(true);
    const url = `${API_BASE_URL}/product/seller/${userId}`;

    try {
      const api = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (api.ok) {
        const data = await api.json();
        const listaProdutos = Array.isArray(data)
          ? data
          : data.produtos || [];

        const produtosAtivos = listaProdutos.filter(
          (p) => p.status === "Ativo" && p.quantity > 0
        );
        setProdutos(produtosAtivos);
        
        // Inicializa as quantidades de venda com 1 para cada produto
        const initialQuantidades = {};
        produtosAtivos.forEach(p => {
          initialQuantidades[p.id] = 1;
        });
        setQuantidadesVenda(initialQuantidades);
      } else {
        const errorApi = await api.json();
        console.error("Erro ao carregar produtos:", errorApi);
        alert(errorApi.erro || "Erro ao buscar produtos.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Falha na conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  function handleQuantidadeChange(produtoId, novaQuantidade) {
    const quantidade = parseInt(novaQuantidade) || 0;
    const produto = produtos.find(p => p.id === produtoId);
    
    if (quantidade < 0) {
      return;
    }
    
    if (quantidade > produto.quantity) {
      alert(`Quantidade máxima disponível: ${produto.quantity}`);
      return;
    }
    
    setQuantidadesVenda(prev => ({
      ...prev,
      [produtoId]: quantidade
    }));
  }

  function calcularValorTotal(produto) {
    const quantidade = quantidadesVenda[produto.id] || 0;
    return (quantidade * produto.price).toFixed(2);
  }

  async function handleVenda(produto) {
    const quantidadeVenda = quantidadesVenda[produto.id] || 0;
    
    if (quantidadeVenda <= 0) {
      alert("Quantidade de venda deve ser maior que zero.");
      return;
    }
    
    if (quantidadeVenda > produto.quantity) {
      alert(`Quantidade disponível insuficiente. Estoque: ${produto.quantity}`);
      return;
    }

    const valorTotal = calcularValorTotal(produto);

    if (!window.confirm(`Confirmar venda de ${quantidadeVenda} unidade(s) de ${produto.name} por R$ ${valorTotal}?`)) {
      return;
    }

    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/");
      return;
    }

    // Endpoint correto conforme seu backend
    const url = `${API_BASE_URL}/sell`;

    try {
      const api = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: parseFloat(valorTotal),
          quantity: quantidadeVenda,
          id_product: produto.id
          // id_seller será adicionado automaticamente pelo backend através do token JWT
        }),
      });

      if (api.ok) {
        const response = await api.json();
        alert(response.mensagem || "Venda realizada com sucesso!");
        // Recarrega os produtos para atualizar o estoque
        carregarProdutos();
      } else {
        const errorApi = await api.json();
        console.error("Erro ao realizar venda:", errorApi);
        alert(errorApi.erro || "Erro ao realizar venda.");
      }
    } catch (error) {
      console.error("Erro na requisição de venda:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }
  
  return (
    <div className="main-container">
      <div className="content-wrapper-list">
        <div className="data-section">
          <h3>Vender Produtos</h3>

          {loading ? (
            <p>Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p>Nenhum produto disponível para venda.</p>
          ) : (
            <ul className="product" id="product-1">
              {produtos.map((produto) => (
                <li key={produto.id} className="list-class" id={`list-id-${produto.id}`}>

                  {/* Mostra imagem do produto */}
                  <div className="product-image-container">
                    <img
                      src={`http://127.0.0.1:5000${produto.url_image}`}
                      alt={produto.name}
                      className="product-image"
                    />
                  </div>

                  <ul className="description-list-sell">
                    <li><strong>{produto.name}</strong></li>
                    <li>Disponível: {produto.quantity}</li>
                    <li>Preço (un): R$ {Number(produto.price).toFixed(2)}</li>
                    <li>
                      <label>
                        Quantidade:
                        <input
                          type="number"
                          min="0"
                          max={produto.quantity}
                          value={quantidadesVenda[produto.id] || 0}
                          onChange={(e) => handleQuantidadeChange(produto.id, e.target.value)}
                          style={{ marginLeft: '10px', width: '80px' }}
                        />
                      </label>
                    </li>
                    <li>
                      <strong>Total: R$ {calcularValorTotal(produto)}</strong>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="ClassButton"
                        onClick={() => handleVenda(produto)}
                        disabled={!quantidadesVenda[produto.id] || quantidadesVenda[produto.id] <= 0}
                      >
                        Vender
                      </button>
                    </li>
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}