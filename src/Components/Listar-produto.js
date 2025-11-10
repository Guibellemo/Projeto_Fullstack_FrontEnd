// Listar-produto.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function ListarProduto() {
  const navigate = useNavigate();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

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
          (p) => p.status === "Ativo"
        );
        setProdutos(produtosAtivos);
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

  function handleEditClick(produto) {
    setEditingId(produto.id);
    setEditData({
      name: produto.name,
      quantity: produto.quantity,
      price: produto.price,
      id_seller: produto.id_seller,
      status: produto.status,
      url_image: produto.url_image
    });
    setSelectedFile(null);
  }

  function handleEditChange(field, value) {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function handleFileChange(e) {
    setSelectedFile(e.target.files[0]);
  }

  async function handleSaveEdit(id) {
    const token = getToken();
    const userId = getUserId();

    if (!token || !userId) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/");
      return;
    }

    const url = `${API_BASE_URL}/product/${id}`;
    const formData = new FormData();

    formData.append("name", editData.name);
    formData.append("quantity", editData.quantity);
    formData.append("price", editData.price);
    formData.append("id_seller", userId);
    formData.append("status", 'Ativo');

    if (selectedFile) {
      formData.append("url_image", selectedFile);
    } else {
      formData.append("url_image", editData.url_image);
    }

    try {
      const api = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (api.ok) {
        alert("Produto atualizado com sucesso!");
        setEditingId(null);
        setEditData({});
        setSelectedFile(null);
        carregarProdutos();
      } else {
        const errorApi = await api.json();
        console.error("Erro ao atualizar produto:", errorApi);
        alert(errorApi.erro || errorApi.message || "Erro ao atualizar produto.");
      }
    } catch (error) {
      console.error("Erro na requisição PUT:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }



  function handleCancelEdit() {
    setEditingId(null);
    setEditData({});
    setSelectedFile(null);
  }

  async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja remover este produto?")) {
      return;
    }

    const token = getToken();

    if (!token) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/");
      return;
    }

    const url = `${API_BASE_URL}/product/${id}`;

    try {
      const api = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (api.ok) {
        alert("Produto removido com sucesso!");
        carregarProdutos();
      } else {
        const errorApi = await api.json();
        console.error("Erro ao deletar produto:", errorApi);
        alert(errorApi.erro || "Erro ao deletar produto.");
      }
    } catch (error) {
      console.error("Erro na requisição DELETE:", error);
      alert("Erro ao conectar com o servidor.");
    }
  }

  return (
    <div className="main-container">
      <div className="content-wrapper-list">
        <div className="data-section">
          <h3>Meus Produtos</h3>

          {loading ? (
            <p>Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p>Nenhum produto cadastrado.</p>
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

                  <ul className="description-list">
                    {editingId === produto.id ? (
                      <>
                        <li>
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => handleEditChange("name", e.target.value)}
                          />
                        </li>
                        <li>
                          <input
                            type="number"
                            value={editData.quantity}
                            onChange={(e) => handleEditChange("quantity", e.target.value)}
                          />
                        </li>
                        <li>
                          <input
                            type="number"
                            step="0.01"
                            value={editData.price}
                            onChange={(e) => handleEditChange("price", e.target.value)}
                          />
                        </li>
                        <li>
                          <label className="file-input-label">
                            📂 Imagem
                            <input
                              type="file"
                              className="file-input-hidden"
                              accept="image/*"
                              onChange={handleFileChange}
                            />
                          </label>
                        </li>
                        <li>
                          <button type="button" className="ClassButton" onClick={() => handleSaveEdit(produto.id)}>
                            Salvar 💾
                          </button>
                        </li>
                        <li>
                          <button type="button" className="ClassButton" onClick={handleCancelEdit}>
                            Cancelar ❌
                          </button>
                        </li>
                      </>
                    ) : (
                      <>
                        <li>{produto.name}</li>
                        <li>QTD: {produto.quantity}</li>
                        <li>R$: {Number(produto.price).toFixed(2)}</li>
                        <li>
                          <button
                            type="button"
                            className="ClassButton"
                            onClick={() => handleEditClick(produto)}
                          >
                            Editar ✏️
                          </button>
                        </li>
                        <li>
                          <button
                            type="button"
                            className="ClassButton"
                            onClick={() => handleDelete(produto.id)}
                          >
                            Deletar ❌
                          </button>
                        </li>
                      </>
                    )}
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
