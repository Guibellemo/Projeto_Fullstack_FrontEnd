import './styles.css';
import { Link } from "react-router-dom";

export default function FormCadastro() {

  function postData(e) {
    e.preventDefault();
    alert("Conta criada com sucesso!");
  }

  return (
    <div className="main-container">
      <div className="form-container">
        <form id="form-cadastro" onSubmit={postData}>
          <h2>Faça seu cadastro</h2>
          <input type="text" placeholder="Nome" required id="cadastro-nome" />
          <input type="email" placeholder="E-Mail" required id="cadastro-email" />
          <input type="password" placeholder="Senha" required id="cadastro-senha" />
          <input type="tel" placeholder="Celular" id="cadastro-phone" />
          <input type="text" placeholder="CPF/CNPJ" id="cadastro-documento" />
          <button type="submit" id="botao-criar-conta">Criar Conta</button>
          
        </form>
      </div>
    </div>
  );
}