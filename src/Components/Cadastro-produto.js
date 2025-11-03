import React from 'react';
import './styles.css';

export default function CadastroProduto() {
  
  function handleSaveProduto(e) {
    e.preventDefault();
    alert("Produto cadastrado com sucesso!");
  }

  return (
    <div className="main-container">
      <div className="content-wrapper">
        <div className="data-section">
          <form id="form-cadastro" onSubmit={handleSaveProduto}>
            <h3>Cadastrar produto</h3>
            <input 
              type="text" 
              placeholder="Nome do produto" 
              required 
              id="name" 
              className="nome-produto-class"
            />
            <input 
              type="text" 
              placeholder="Preço" 
              required 
              id="price" 
              className="preco-class"
            />
            <input 
              type="text" 
              placeholder="Quantidade" 
              id="quantity" 
              className="quantidade-class"
            />
            <input 
                type="file" 
                accept="image/*" 
            />
            {/* <input type="text" placeholder="ID" id="id_seller" className="id-seller-class" /> */}
            
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              <button type="submit" id="botao-salvar">
                Salvar 💾
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}