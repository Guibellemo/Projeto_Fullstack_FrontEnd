import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/cadastro_produto">Cadastrar Produto</Link></li>
          <li><Link to="/listar_produto">Listar Produto</Link></li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  );
}