import React, { useState, useEffect } from 'react';
import './styles.css';

export default function ListarProduto() {
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
  }, []);

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <div className="data-section">
          <form id="form-cadastro">
            <h3>Produtos</h3>
            <ul className="product" id="product-1">
              <li className="list-class" id="list-id">
                <ul className="description-list">
                  {/* Aqui vão ser renderizados os produtos dinamicamente */}
                  {produtos.length > 0 ? (
                    produtos.map((produto) => (
                      <li key={produto.id}>
                        {produto.name} - R$ {produto.price}
                      </li>
                    ))
                  ) : (
                    <li>Nenhum produto cadastrado</li>
                  )}
                </ul>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </div>
  );
}