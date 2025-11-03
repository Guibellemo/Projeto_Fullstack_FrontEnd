import './styles.css';
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
}