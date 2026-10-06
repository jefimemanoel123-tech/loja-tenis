import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoMs from '../assets/Logo-ms.png';

function Admin() {
  const navigate = useNavigate();
  
  const [produtos, setProdutos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [nome, setNome] = useState('');
  const [marca, setMarca] = useState('');
  const [valor, setValor] = useState('');
  const [imagens, setImagens] = useState([]);
  const [tamanhos, setTamanhos] = useState('38, 39, 40, 41, 42');
  const [cores, setCores] = useState('Branco, Preto');

  useEffect(() => {
    const logado = localStorage.getItem('ms_logado');
    if (!logado) {
      navigate('/login');
    }

    const produtosSalvos = JSON.parse(localStorage.getItem('ms_produtos')) || [
      { id: 1, nome: 'Tenis Nike Air Force 1', marca: 'Nike', valor: 350.00, tamanhos: [38, 39, 40, 41, 42], cores: ['Branco', 'Preto/Branco'], imagens: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'] },
      { id: 2, nome: 'Tenis Adidas Superstar', marca: 'Adidas', valor: 320.00, tamanhos: [37, 38, 39, 40], cores: ['Branco/Preto', 'Total Black'], imagens: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500'] }
    ];
    setProdutos(produtosSalvos);
  }, [navigate]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    let novasImagens = [];

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        novasImagens.push(reader.result);
        if (novasImagens.length === files.length) {
          setImagens((prev) => [...prev, ...novasImagens]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSalvarProduto = (e) => {
    e.preventDefault();
    if (!nome || !valor || imagens.length === 0) {
      alert('Preencha os campos obrigatorios e adicione ao menos uma foto!');
      return;
    }

    let novosProdutos;

    if (editandoId !== null) {
      novosProdutos = produtos.map((p) => {
        if (p.id === editandoId) {
          return {
            ...p,
            nome,
            marca,
            valor: parseFloat(valor),
            imagens,
            tamanhos: typeof tamanhos === 'string' ? tamanhos.split(',').map(t => t.trim()) : tamanhos,
            cores: typeof cores === 'string' ? cores.split(',').map(c => c.trim()) : cores
          };
        }
        return p;
      });
      alert('Produto atualizado com sucesso!');
    } else {
      const novoProduto = {
        id: Date.now(),
        nome,
        marca,
        valor: parseFloat(valor),
        imagens,
        tamanhos: tamanhos.split(',').map(t => t.trim()),
        cores: cores.split(',').map(c => c.trim())
      };
      novosProdutos = [...produtos, novoProduto];
      alert('Tenis cadastrado com sucesso!');
    }

    setProdutos(novosProdutos);
    localStorage.setItem('ms_produtos', JSON.stringify(novosProdutos));
    limparFormulario();
  };

  const iniciarEdicao = (produto) => {
    setEditandoId(produto.id);
    setNome(produto.nome);
    setMarca(produto.marca);
    setValor(produto.valor);
    setImagens(produto.imagens || [produto.imagem]);
    setTamanhos(Array.isArray(produto.tamanhos) ? produto.tamanhos.join(', ') : produto.tamanhos);
    setCores(Array.isArray(produto.cores) ? produto.cores.join(', ') : produto.cores);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setNome('');
    setMarca('');
    setValor('');
    setImagens([]);
    setTamanhos('38, 39, 40, 41, 42');
    setCores('Branco, Preto');
  };

  const excluirProduto = (id) => {
    if (window.confirm('Deseja realmente excluir este produto?')) {
      const novosProdutos = produtos.filter(p => p.id !== id);
      setProdutos(novosProdutos);
      localStorage.setItem('ms_produtos', JSON.stringify(novosProdutos));
      if (editandoId === id) limparFormulario();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ms_logado');
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }}>
      
      <header style={{ background: '#111', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={LogoMs} alt="Logo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
          <h2 style={{ fontSize: '18px', margin: '0' }}><span translate="no">MS Store</span> - Painel Administrativo</h2>
        </div>
        <div>
          <button onClick={() => navigate('/')} style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', marginRight: '10px', cursor: 'pointer' }}>Ver Site</button>
          <button onClick={handleLogout} style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Sair</button>
        </div>
      </header>

      <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px' }}>
        
        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h3 style={{ marginTop: '0', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
            {editandoId !== null ? 'Editar Tenis' : 'Cadastrar Novo Tenis'}
          </h3>
          
          <form onSubmit={handleSalvarProduto} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Nome do Tenis:</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Nike Jordan" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Marca:</label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ex: Nike" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Valor (R$):</label>
              <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="350.00" required style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Fotos (Multiplas):</label>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fafafa' }} />
            </div>

            {imagens.length > 0 && (
              <div style={{ gridColumn: 'span 2', textAlign: 'left' }}>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>Fotos carregadas ({imagens.length}):</p>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {imagens.map((imgSrc, idx) => (
                    <img key={idx} src={imgSrc} alt={`Preview ${idx}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #ccc' }} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Tamanhos (separados por virgula):</label>
              <input type="text" value={tamanhos} onChange={(e) => setTamanhos(e.target.value)} placeholder="38, 39, 40" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Cores (separadas por virgula):</label>
              <input type="text" value={cores} onChange={(e) => setCores(e.target.value)} placeholder="Branco, Preto" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>

            <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
              <button type="submit" style={{ background: '#25D366', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', flex: '1', fontWeight: 'bold', fontSize: '15px' }}>
                {editandoId !== null ? 'Salvar Alteracoes' : 'Salvar e Publicar Tenis'}
              </button>
              {editandoId !== null && (
                <button type="button" onClick={limparFormulario} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={{ background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
          <h3 style={{ marginTop: '0', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Produtos Cadastrados no Site</h3>
          
          {produtos.length === 0 ? (
            <p style={{ color: '#666' }}>Nenhum produto cadastrado.</p>
          ) : (
            <ul style={{ listStyle: 'none', padding: '0' }}>
              {produtos.map((p) => {
                const fotoPrincipal = p.imagens && p.imagens.length > 0 ? p.imagens[0] : p.imagem;
                return (
                  <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', padding: '10px 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={fotoPrincipal} alt={p.nome} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                      <div>
                        <strong>{p.nome}</strong> ({p.marca})<br />
                        <span style={{ fontSize: '13px', color: '#666' }}>R$ {Number(p.valor).toFixed(2)}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => iniciarEdicao(p)} style={{ background: '#f0ad4e', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Editar</button>
                      <button onClick={() => excluirProduto(p.id)} style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>Excluir</button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default Admin;