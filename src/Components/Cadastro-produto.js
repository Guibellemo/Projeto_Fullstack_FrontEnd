// CadastroProduto.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

const API_BASE_URL = URL_RENDER;

export default function CadastroProduto() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  function getToken() {
    return localStorage.getItem("access_token");
  }

  function getUserId() {
    return localStorage.getItem("user_id");
  }

  function handleChange(e) {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  }

  function handleImageChange(e) {
    setImageFile(e.target.files[0]);
  }

  async function handleSaveProduto(e) {
    e.preventDefault();
    setLoading(true);

    const userId = getUserId();
    const token = getToken();

    if (!token || !userId) {
      alert("Sessão expirada. Faça login novamente.");
      navigate("/");
      return;
    }

    const priceNumber = parseFloat(formData.price.replace(",", "."));
    const quantityNumber = parseInt(formData.quantity);

    if (!formData.name || isNaN(priceNumber) || isNaN(quantityNumber)) {
      alert("Preencha os campos corretamente.");
      setLoading(false);
      return;
    }

    if (!imageFile) {
      alert("Envie uma imagem do produto.");
      setLoading(false);
      return;
    }

    const url = `${API_BASE_URL}/product`;

    // ✅ Enviar via FormData (backend exige)
    const body = new FormData();
    body.append("name", formData.name);
    body.append("price", priceNumber);
    body.append("quantity", quantityNumber);
    body.append("id_seller", userId);
    body.append("url_image", imageFile);

    try {
      const api = await fetch(url, {
        method: "POST",
        headers: {
          // ✅ NÃO definir Content-Type → fetch cria boundary automaticamente
          "Authorization": `Bearer ${token}`,
        },
        body,
      });

      const data = await api.json();

      if (api.ok) {
        alert("Produto cadastrado com sucesso!");

        setFormData({
          name: "",
          price: "",
          quantity: "",
        });

        setImageFile(null);
      } else {
        alert(data.erro || data.message || "Erro ao cadastrar produto.");
      }
    } catch (err) {
      console.error("Erro ao conectar:", err);
      alert("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <div className="data-section">
          <form id="form-cadastro" onSubmit={handleSaveProduto}>
            <h3>Cadastrar produto</h3>

            <input
              type="text"
              id="name"
              placeholder="Nome do produto"
              className="nome-produto-class"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="text"
              id="price"
              placeholder="Preço (ex: 15.90)"
              className="preco-class"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <input
              type="number"
              id="quantity"
              placeholder="Quantidade"
              className="quantidade-class"
              value={formData.quantity}
              onChange={handleChange}
              required
              disabled={loading}
            />

            {/* ✅ Upload obrigatório */}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
              disabled={loading}
            />

            <button type="submit" id="botao-salvar" disabled={loading}>
              {loading ? "Salvando..." : "Salvar 💾"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
