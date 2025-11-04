import React from 'react';
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './Components/Login';
import Cadastro from './Components/Cadastro';
import Ativacao from './Components/Ativacao';
import Home from './Components/Home';
import Cadastro_Produto from './Components/Cadastro-produto';
import Listar_Produto from './Components/Listar-produto';
import Layout from './Components/Layout';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/ativacao" element={<Ativacao />} />

          {/* Rotas com Layout (navbar) */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/cadastro_produto" element={<Cadastro_Produto />} />
            <Route path="/listar_produto" element={<Listar_Produto />} />
          </Route>
        </Routes>
        {/*
        <nav>
          <ul>
            <li><Link to="/">Login</Link></li>
            <li><Link to="/cadastro">Cadastro</Link></li>
            <li><Link to="/ativacao">Código</Link></li>
            <li><Link to="/home">Home</Link></li>
            <li><Link to="/cadastro_produto">Cadastrar Produto</Link></li>
            <li><Link to="/listar_produto">Listar Produto</Link></li>
          </ul>
        </nav>
        

        <main>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/ativacao" element={<Ativacao />} />
            <Route path="/home" element={<Home />} />
            <Route path="/cadastro_produto" element={<Cadastro_Produto />} />
            <Route path="/listar_produto" element={<Listar_Produto />} />
          </Routes>
        </main>
        */}

      </div>
    </Router>
  );
}

export default App;