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
  const [genero, setGenero] = useState('Unissex');
  const [tamanhos, setTamanhos] = useState('38, 39, 40, 41, 42');
  const [cores, setCores] = useState('Branco, Preto');
  const [observacao, setObservacao] = useState('');
  const [imagens, setImagens] = useState([]);

  useEffect(() => {
    const logado = localStorage.getItem('ms_admin_logado');
    if (!logado) {
      navigate('/login');
      return;
    }
    carregarProdutos();
  }, [navigate]);

  const carregarProdutos = () => {
    const salvos = JSON.parse(localStorage.getItem('ms_produtos')) || [];
    setProdutos(salvos);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagens((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removerImagemIndividual = (indexParaRemover) => {
    setImagens((prev) => prev.filter((_, index) => index !== indexParaRemover));
  };

  const salvarProduto = (e) => {
    e.preventDefault();
    if (!nome || !valor) {
      alert('Preencha pelo menos o nome e o valor do tênis!');
      return;
    }

    const arrayTamanhos = tamanhos.split(',').map((t) => t.trim()).filter(Boolean);
    const arrayCores = cores.split(',').map((c) => c.trim()).filter(Boolean);
    const listaImgs = imagens.length > 0 ? imagens : ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'];

    const novoProdutoObj = {
      id: editandoId ? editandoId : Date.now(),
      nome,
      marca,
      valor: parseFloat(valor),
      genero,
      tamanhos: arrayTamanhos,
      cores: arrayCores,
      observacao,
      imagens: listaImgs,
    };

    let produtosAtualizados;
    if (editandoId) {
      produtosAtualizados = produtos.map((p) => (p.id === editandoId ? novoProdutoObj : p));
    } else {
      produtosAtualizados = [novoProdutoObj, ...produtos];
    }

    localStorage.setItem('ms_produtos', JSON.stringify(produtosAtualizados));
    setProdutos(produtosAtualizados);
    limparFormulario();
    alert('Produto salvo com sucesso!');
  };

  const iniciarEdicao = (produto) => {
    setEditandoId(produto.id);
    setNome(produto.nome);
    setMarca(produto.marca);
    setValor(produto.valor);
    setGenero(produto.genero || 'Unissex');
    setTamanhos(produto.tamanhos ? produto.tamanhos.join(', ') : '');
    setCores(produto.cores ? produto.cores.join(', ') : '');
    setObservacao(produto.observacao || '');
    setImagens(produto.imagens || []);
  };

  const excluirProduto = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      const produtosAtualizados = produtos.filter((p) => p.id !== id);
      localStorage.setItem('ms_produtos', JSON.stringify(produtosAtualizados));
      setProdutos(produtosAtualizados);
      if (editandoId === id) limparFormulario();
    }
  };

  const limparFormulario = () => {
    setEditandoId(null);
    setNome('');
    setMarca('');
    setValor('');
    setGenero('Unissex');
    setTamanhos('38, 39, 40, 41, 42');
    setCores('Branco, Preto');
    setObservacao('');
    setImagens([]);
  };

  const fazerLogout = () => {
    localStorage.removeItem('ms_admin_logado');
    navigate('/login');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f4f4f4', minHeight: '100vh', padding: '20px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto 20px auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111', color: '#fff', padding: '15px 25px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={LogoMs} alt="Logo MS Store" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
          <h2 style={{ margin: 0, fontSize: '18px' }}>Painel Administrativo - MS Store</h2>
        </div>
        <div>
          <button onClick={() => navigate('/')} style={{ background: '#333', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}>Ver Loja 🏠</button>
          <button onClick={fazerLogout} style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>Sair 🚪</button>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto 30px auto', background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, color: '#222', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          {editandoId ? '✏ Editar Produto' : '➕ Adicionar Novo Tênis'}
        </h3>

        <form onSubmit={salvarProduto}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Nome do Tênis:</label>
              <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Nike Air Force" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Marca:</label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Ex: Nike, Adidas, NB" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Valor (R$):</label>
              <input type="number" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} placeholder="350.00" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} required />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Gênero:</label>
              <select value={genero} onChange={(e) => setGenero(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fff' }}>
                <option value="Unissex">Unissex</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Tamanhos (vírgula):</label>
              <input type="text" value={tamanhos} onChange={(e) => setTamanhos(e.target.value)} placeholder="38, 39, 40" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Cores (vírgula):</label>
              <input type="text" value={cores} onChange={(e) => setCores(e.target.value)} placeholder="Branco, Preto" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Observação / Cupom (Ex: Frete Grátis):</label>
              <input type="text" value={observacao} onChange={(e) => setObservacao(e.target.value)} placeholder="Ex: Use o cupom MS10" style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Fotos do Tênis:</label>
            <input type="file" multiple accept="image/*" onChange={handleFileUpload} style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', background: '#fafafa' }} />
          </div>

          {imagens.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '8px' }}>Fotos adicionadas ({imagens.length}):</p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {imagens.map((imgSrc, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '70px', height: '70px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden', background: '#eee' }}>
                    <img src={imgSrc} alt={`Preview ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button 
                      type="button"
                      onClick={() => removerImagemIndividual(idx)}
                      style={{ position: 'absolute', top: '2px', right: '2px', background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="submit" style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              {editandoId ? 'Salvar Alterações' : 'Cadastrar Tênis'}
            </button>
            {editandoId && (
              <button type="button" onClick={limparFormulario} style={{ background: '#6c757d', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                Cancelar Edição
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', background: '#fff', padding: '25px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h3 style={{ marginTop: 0, color: '#222', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Produtos Cadastrados ({produtos.length})</h3>
        
        {produtos.length === 0 ? (
          <p style={{ color: '#666' }}>Nenhum tênis cadastrado ainda.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {produtos.map((prod) => (
              <div key={prod.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #eee', padding: '12px', borderRadius: '6px', background: '#fafafa' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <img src={prod.imagens && prod.imagens.length > 0 ? prod.imagens[0] : 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'} alt={prod.nome} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '15px' }}>{prod.nome} <span style={{ fontSize: '11px', background: '#ddd', padding: '2px 6px', borderRadius: '4px', marginLeft: '5px' }}>{prod.genero || 'Unissex'}</span></h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>{prod.marca} | <strong>R$ {Number(prod.valor).toFixed(2)}</strong></p>
                    {prod.observacao && <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#d9534f' }}>Obs: {prod.observacao}</p>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => iniciarEdicao(prod)} style={{ background: '#f0ad4e', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Editar</button>
                  <button onClick={() => excluirProduto(prod.id)} style={{ background: '#d9534f', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Excluir</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Admin;