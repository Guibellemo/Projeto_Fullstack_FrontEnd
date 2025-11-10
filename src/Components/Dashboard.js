import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react';
import './styles.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('vendas');
  const [stockData, setStockData] = useState([]);
  const [salesData, setSalesData] = useState({ top3: [], all: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
    const interval = setInterval(() => {
      carregarEstoque();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  function getToken() {
    return localStorage.getItem('access_token');
  }

  function getUserId() {
    return localStorage.getItem('user_id');
  }

  async function carregarDados() {
    await Promise.all([
      carregarEstoque(),
      carregarDadosVendas()
    ]);
    setLoading(false);
  }

  async function carregarEstoque() {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
      alert('Sessão expirada. Faça login novamente.');
      navigate('/');
      return;
    }
    try {
      const api = await fetch(`${API_BASE_URL}/product/seller/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (api.ok) {
        const data = await api.json();
        const produtos = Array.isArray(data) ? data : data.produtos || [];
        const produtosFormatados = produtos
          .filter(p => p.status === 'Ativo')
          .map(p => ({
            id: p.id,
            produto: p.name,
            quantidade: p.quantity,
            preco: parseFloat(p.price),
            minimo: 10,
            categoria: 'Produtos'
          }));
        setStockData(produtosFormatados);
      }
    } catch (error) {
      console.error('Erro ao carregar estoque:', error);
    }
  }

  async function carregarDadosVendas() {
    const token = getToken();
    const userId = getUserId();
    if (!token || !userId) {
      alert('Sessão expirada. Faça login novamente.');
      navigate('/');
      return;
    }
    try {
      const topResponse = await fetch(`${API_BASE_URL}/report/three/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const allResponse = await fetch(`${API_BASE_URL}/report/all/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!topResponse.ok || !allResponse.ok) {
        console.error("Erro ao buscar relatórios de vendas");
        return;
      }
      const top3 = await topResponse.json();
      const all = await allResponse.json();
      setSalesData({ top3, all });
    } catch (error) {
      console.error("Erro ao carregar relatório de vendas:", error);
    }
  }

  const totalVendidos = salesData.all.reduce((acc, item) => acc + item.quantidade_vendida, 0);
  const totalProdutos = salesData.all.length;
  const valorTotalEstoque = stockData.reduce((acc, curr) => acc + (curr.quantidade * curr.preco), 0);

  const MetricCard = ({ icon: Icon, title, value, subtitle }) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '8px',
      padding: '24px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginBottom: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ color: '#666', fontSize: '14px', fontWeight: '500', margin: 0 }}>{title}</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#333', margin: '8px 0' }}>{value}</p>
          {subtitle && <p style={{ fontSize: '13px', color: '#666', margin: 0 }}>{subtitle}</p>}
        </div>
        <div style={{
          padding: '12px',
          borderRadius: '50%',
          backgroundColor: '#f3f4f6'
        }}>
          <Icon size={24} color="#666" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="main-container">
        <div className="content-wrapper">
          <p style={{ textAlign: 'center', fontSize: '18px' }}>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '4px',
            display: 'inline-flex',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <button
              onClick={() => setActiveTab('vendas')}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: activeTab === 'vendas' ? '#49708A' : 'transparent',
                color: activeTab === 'vendas' ? 'white' : '#666'
              }}
            >
              Relatório de Vendas
            </button>
            <button
              onClick={() => setActiveTab('estoque')}
              style={{
                padding: '12px 24px',
                borderRadius: '6px',
                border: 'none',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.3s',
                backgroundColor: activeTab === 'estoque' ? '#49708A' : 'transparent',
                color: activeTab === 'estoque' ? 'white' : '#666'
              }}
            >
              Monitoramento de Estoque
            </button>
          </div>
        </div>

        {activeTab === 'vendas' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              <MetricCard icon={DollarSign} title="Total Vendido (unidades)" value={totalVendidos} />
              <MetricCard icon={TrendingUp} title="Produtos Vendidos" value={totalProdutos} />
              <MetricCard icon={ShoppingCart} title="Top 3 Produtos" value={salesData.top3.length} />
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '500' }}>
                  Produtos Mais Vendidos (Todos)
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData.all}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="produto" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade_vendida" fill="#49708A" name="Unidades Vendidas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '24px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '500' }}>
                  Top 3 Produtos Mais Vendidos
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesData.top3}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="produto" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="quantidade_vendida" fill="#10b981" name="Unidades Vendidas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'estoque' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              <MetricCard icon={Package} title="Produtos Cadastrados" value={stockData.length} />
              <MetricCard
                icon={DollarSign}
                title="Valor Total Estoque"
                value={`R$ ${valorTotalEstoque.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
              />
              <MetricCard
                icon={Package}
                title="Itens em Estoque"
                value={stockData.reduce((acc, curr) => acc + curr.quantidade, 0)}
              />
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ padding: '24px', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '500' }}>Produtos em Estoque</h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#666' }}>
                  Atualização automática a cada 10 segundos
                </p>
              </div>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {stockData.length === 0 ? (
                  <p style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
                    Nenhum produto cadastrado
                  </p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb', position: 'sticky', top: 0 }}>
                      <tr>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#666', textTransform: 'uppercase' }}>Produto</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#666', textTransform: 'uppercase' }}>Quantidade</th>
                        <th style={{ padding: '12px', textAlign: 'left', fontSize: '12px', fontWeight: '500', color: '#666', textTransform: 'uppercase' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockData.map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                          <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500' }}>{item.produto}</td>
                          <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>{item.quantidade} un</td>
                          <td style={{ padding: '12px' }}>
                            {item.quantidade < item.minimo ? (
                              <span style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#991b1b' }}>Baixo</span>
                            ) : item.quantidade < item.minimo * 1.5 ? (
                              <span style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '12px', backgroundColor: '#fef3c7', color: '#92400e' }}>Atenção</span>
                            ) : (
                              <span style={{ padding: '4px 8px', fontSize: '12px', fontWeight: '600', borderRadius: '12px', backgroundColor: '#d1fae5', color: '#065f46' }}>Normal</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
