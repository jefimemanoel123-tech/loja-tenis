import React, { useState, useEffect } from 'react';
import LogoMs from '../assets/Logo-ms.png';

function Home() {
  const lerLocalStorage = (chave, valorPadrao) => {
    try {
      const valor = localStorage.getItem(chave);
      return valor ? JSON.parse(valor) : valorPadrao;
    } catch {
      return valorPadrao;
    }
  };

  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [nomeCliente, setNomeCliente] = useState('');
  const [enderecoCliente, setEnderecoCliente] = useState('');
  const [pagamento, setPagamento] = useState('Pix');
  const [parcelas, setParcelas] = useState('1x');

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState({});
  const [corSelecionada, setCorSelecionada] = useState({});
  const [indiceFoto, setIndiceFoto] = useState({});
  const [imagemExpandida, setImagemExpandida] = useState(null);
  const [carrinhoAbertoMobile, setCarrinhoAbertoMobile] = useState(false);

  const [filtroGenero, setFiltroGenero] = useState('Todos');
  const [filtroMarca, setFiltroMarca] = useState('Todas');
  const [filtroTamanho, setFiltroTamanho] = useState('Todos');
  const [filtroPrecoMax, setFiltroPrecoMax] = useState('1000');
  const [mostrarApenasFavoritos, setMostrarApenasFavoritos] = useState(false);

  useEffect(() => {
    const produtosSalvos = lerLocalStorage('ms_produtos', [
      {
        id: 1,
        nome: 'Tenis Nike Air Force 1',
        marca: 'Nike',
        valor: 350.0,
        genero: 'Unissex',
        tamanhos: [38, 39, 40, 41, 42],
        cores: ['Branco', 'Preto/Branco'],
        observacao: 'Frete Grátis para BH!',
        imagens: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500']
      },
      {
        id: 2,
        nome: 'Tenis Adidas Superstar',
        marca: 'Adidas',
        valor: 320.0,
        genero: 'Feminino',
        tamanhos: [37, 38, 39, 40],
        cores: ['Branco/Preto', 'Total Black'],
        observacao: 'Cupom: MS10',
        imagens: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500']
      }
    ]);
    setProdutos(produtosSalvos);

    const favoritosSalvos = lerLocalStorage('ms_favoritos', []);
    setFavoritos(favoritosSalvos);
  }, []);

  const toggleFavorito = (produtoId, e) => {
    e.stopPropagation();
    setFavoritos((prevFavoritos) => {
      const novosFavoritos = prevFavoritos.includes(produtoId)
        ? prevFavoritos.filter((id) => id !== produtoId)
        : [...prevFavoritos, produtoId];

      localStorage.setItem('ms_favoritos', JSON.stringify(novosFavoritos));
      return novosFavoritos;
    });
  };

  const handleTamanhoChange = (produtoId, tamanho) => {
    setTamanhoSelecionado({ ...tamanhoSelecionado, [produtoId]: tamanho });
  };

  const handleCorChange = (produtoId, cor) => {
    setCorSelecionada({ ...corSelecionada, [produtoId]: cor });
  };

  const proximaFoto = (produtoId, totalImagens, e) => {
    e.stopPropagation();
    const atual = indiceFoto[produtoId] || 0;
    const proximo = (atual + 1) % totalImagens;
    setIndiceFoto({ ...indiceFoto, [produtoId]: proximo });
  };

  const fotoAnterior = (produtoId, totalImagens, e) => {
    e.stopPropagation();
    const atual = indiceFoto[produtoId] || 0;
    const anterior = (atual - 1 + totalImagens) % totalImagens;
    setIndiceFoto({ ...indiceFoto, [produtoId]: anterior });
  };

  const adicionarAoCarrinho = (produto) => {
    const tamanhoEscolhido = tamanhoSelecionado[produto.id] || (produto.tamanhos ? produto.tamanhos[0] : 'Unico');
    const corEscolhida = corSelecionada[produto.id] || (produto.cores ? produto.cores[0] : 'Unica');

    const itemCarrinho = {
      ...produto,
      tamanhoEscolhido,
      corEscolhida
    };

    setCarrinho((prevCarrinho) => [...prevCarrinho, itemCarrinho]);
    alert(`${produto.nome} adicionado ao carrinho!`);
  };

  const removerDoCarrinho = (indexParaRemover) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.valor, 0).toFixed(2);
  };

  const finalizarCompraWhatsApp = () => {
    if (carrinho.length === 0) {
      alert('O seu carrinho está vazio!');
      return;
    }
    if (!nomeCliente || !enderecoCliente) {
      alert('Por favor, preencha seu nome e endereço antes de finalizar.');
      return;
    }

    let mensagem = `*Novo Pedido - MS Store*\n\n`;
    mensagem += `*Cliente:* ${nomeCliente}\n`;
    mensagem += `*Endereço:* ${enderecoCliente}\n`;
    mensagem += `*Forma de Pagamento:* ${pagamento}`;
    
    if (pagamento === 'Cartao de Credito') {
      mensagem += ` (${parcelas})\n`;
    } else {
      mensagem += `\n`;
    }

    mensagem += `\n*Itens do Pedido:*\n`;
    
    carrinho.forEach((item, index) => {
      mensagem += `\n${index + 1}. *${item.nome}* (${item.marca})\n`;
      mensagem += `   - Tamanho: ${item.tamanhoEscolhido}\n`;
      mensagem += `   - Cor: ${item.corEscolhida}\n`;
      mensagem += `   - Valor: R$ ${Number(item.valor).toFixed(2)}\n`;
    });

    mensagem += `\n*Total a Pagar:* R$ ${calcularTotal()}`;

    const numeroWhatsApp = '5531971737537';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
  };

  const marcasDisponiveis = ['Todas', ...new Set(produtos.map((p) => p.marca).filter(Boolean))];
  const tamanhosDisponiveis = ['Todos', ...new Set(produtos.flatMap((p) => p.tamanhos || []))];

  const produtosFiltrados = produtos.filter((produto) => {
    const atendeGenero = filtroGenero === 'Todos' || produto.genero === filtroGenero;
    const atendeMarca = filtroMarca === 'Todas' || produto.marca === filtroMarca;
    const atendeTamanho = filtroTamanho === 'Todos' || (produto.tamanhos && produto.tamanhos.map(String).includes(String(filtroTamanho)));
    const atendePreco = produto.valor <= Number(filtroPrecoMax);
    const atendeFavoritos = !mostrarApenasFavoritos || favoritos.includes(produto.id);

    return atendeGenero && atendeMarca && atendeTamanho && atendePreco && atendeFavoritos;
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }} translate="yes">
      <header style={{ background: '#111', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', position: 'sticky', top: 0, zIndex: 999 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={LogoMs} alt="MS Store Logo" style={{ width: '45px', height: '45px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
          <h1 style={{ fontSize: '20px', margin: '0', letterSpacing: '1px' }}><span translate="no">MS STORE</span></h1>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setMostrarApenasFavoritos(!mostrarApenasFavoritos)}
            style={{ background: mostrarApenasFavoritos ? '#e74c3c' : '#333', color: '#fff', border: '1px solid #555', padding: '8px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            ❤️ Favoritos ({favoritos.length})
          </button>
          <button 
            onClick={() => setCarrinhoAbertoMobile(true)}
            style={{ background: '#333', color: '#fff', border: '1px solid #555', padding: '8px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }} 
            translate="no"
          >
            🛒 Carrinho: {carrinho.length}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: '1300px', margin: '30px auto', padding: '0 20px', display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
        <div style={{ flex: '3', minWidth: '300px' }}>
          <div style={{ background: '#fff', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #e0e0e0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#111' }}>🔍 Filtrar Tênis</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', color: '#555', marginBottom: '4px' }}>Gênero:</label>
                <select value={filtroGenero} onChange={(e) => setFiltroGenero(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="Todos">Todos</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Unissex">Unissex</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', color: '#555', marginBottom: '4px' }}>Marca:</label>
                <select value={filtroMarca} onChange={(e) => setFiltroMarca(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  {marcasDisponiveis.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', color: '#555', marginBottom: '4px' }}>Tamanho:</label>
                <select value={filtroTamanho} onChange={(e) => setFiltroTamanho(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '13px', borderRadius: '4px', border: '1px solid #ccc' }}>
                  {tamanhosDisponiveis.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 'bold', display: 'block', color: '#555', marginBottom: '4px' }}>Até R$ {filtroPrecoMax}:</label>
                <input 
                  type="range" 
                  min="150" 
                  max="1000" 
                  step="50" 
                  value={filtroPrecoMax} 
                  onChange={(e) => setFiltroPrecoMax(e.target.value)} 
                  style={{ width: '100%', cursor: 'pointer', marginTop: '6px' }} 
                />
              </div>
            </div>
          </div>

          <h2 style={{ marginBottom: '20px', color: '#222', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>
            {mostrarApenasFavoritos ? '❤️ Meus Tênis Favoritos' : 'Lançamentos Disponíveis'} ({produtosFiltrados.length})
          </h2>

          {produtosFiltrados.length === 0 ? (
            <p style={{ color: '#666', background: '#fff', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>Nenhum tênis encontrado.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '15px' }}>
              {produtosFiltrados.map((produto) => {
                const listaImagens = produto.imagens && produto.imagens.length > 0 ? produto.imagens : [produto.imagem || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'];
                const indiceAtual = indiceFoto[produto.id] || 0;
                const fotoExibida = listaImagens[indiceAtual];
                const ehFavorito = favoritos.includes(produto.id);

                return (
                  <div key={produto.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '12px', textAlign: 'left', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    
                    <div>
                      <div 
                        onClick={() => setImagemExpandida(fotoExibida)}
                        style={{ position: 'relative', width: '100%', height: '150px', marginBottom: '10px', cursor: 'pointer', background: '#f9f9f9', borderRadius: '6px', overflow: 'hidden' }}
                        title="Clique para ampliar a foto"
                      >
                        <img src={fotoExibida} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        
                        {produto.genero && (
                          <span style={{ position: 'absolute', top: '5px', left: '5px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '9px', padding: '2px 5px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {produto.genero}
                          </span>
                        )}

                        <button 
                          onClick={(e) => toggleFavorito(produto.id, e)}
                          style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '26px', height: '26px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title={ehFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                        >
                          {ehFavorito ? '❤️' : '🤍'}
                        </button>

                        {listaImagens.length > 1 && (
                          <>
                            <button 
                              onClick={(e) => fotoAnterior(produto.id, listaImagens.length, e)}
                              style={{ position: 'absolute', left: '4px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              ‹
                            </button>
                            <button 
                              onClick={(e) => proximaFoto(produto.id, listaImagens.length, e)}
                              style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              ›
                            </button>
                            <div style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '9px', padding: '2px 5px', borderRadius: '4px' }}>
                              {indiceAtual + 1}/{listaImagens.length}
                            </div>
                          </>
                        )}
                      </div>

                      <h3 style={{ fontSize: '15px', margin: '8px 0 4px 0', color: '#111' }}>{produto.nome}</h3>
                      <p style={{ color: '#666', margin: '0 0 6px 0', fontSize: '13px' }}>{produto.marca}</p>
                      
                      {produto.observacao && (
                        <div style={{ background: '#fff3cd', color: '#856404', fontSize: '11px', padding: '4px 6px', borderRadius: '4px', marginBottom: '8px', fontWeight: 'bold', border: '1px solid #ffeeba' }}>
                          🎁 {produto.observacao}
                        </div>
                      )}

                      <p style={{ fontSize: '17px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#000' }}>R$ {Number(produto.valor).toFixed(2)}</p>
                    </div>

                    <div>
                      <div style={{ marginBottom: '6px' }}>
                        <select 
                          onChange={(e) => handleTamanhoChange(produto.id, e.target.value)}
                          style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                        >
                          {produto.tamanhos && produto.tamanhos.map((tam) => (
                            <option key={tam} value={tam}>Tam: {tam}</option>
                          ))}
                        </select>
                      </div>

                      <div style={{ marginBottom: '10px' }}>
                        <select 
                          onChange={(e) => handleCorChange(produto.id, e.target.value)}
                          style={{ width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px' }}
                        >
                          {produto.cores && produto.cores.map((cor) => (
                            <option key={cor} value={cor}>Cor: {cor}</option>
                          ))}
                        </select>
                      </div>

                      <button 
                        onClick={() => adicionarAoCarrinho(produto)}
                        style={{ background: '#000', color: '#fff', border: 'none', padding: '9px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '13px' }}
                        translate="no"
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="carrinho-desktop" style={{ flex: '1.2', minWidth: '280px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', height: 'fit-content', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h2 style={{ marginTop: '0', color: '#111', borderBottom: '1px solid #eee', paddingBottom: '10px', fontSize: '18px' }}>Seu Carrinho</h2>
          {carrinho.length === 0 ? (
            <p style={{ color: '#666', fontSize: '14px' }}>O carrinho está vazio.</p>
          ) : (
            <div>
              <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                {carrinho.map((item, index) => (
                  <li key={index} style={{ marginBottom: '10px', fontSize: '13px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                    <strong>{item.nome}</strong><br />
                    Tam: {item.tamanhoEscolhido} | Cor: {item.corEscolhida}<br />
                    R$ {Number(item.valor).toFixed(2)}
                    <button onClick={() => removerDoCarrinho(index)} style={{ marginLeft: '10px', color: '#d9534f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>[Remover]</button>
                  </li>
                ))}
              </ul>
              
              <h3 style={{ borderTop: '1px solid #eee', paddingTop: '10px', color: '#111', fontSize: '16px' }}>Total: R$ {calcularTotal()}</h3>

              <div style={{ marginTop: '15px' }}>
                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>Seu Nome:</label>
                <input 
                  type="text" 
                  value={nomeCliente} 
                  onChange={(e) => setNomeCliente(e.target.value)} 
                  placeholder="Nome completo"
                  style={{ width: '100%', padding: '7px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '13px' }}
                />

                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>Endereço (para frete):</label>
                <textarea 
                  value={enderecoCliente} 
                  onChange={(e) => setEnderecoCliente(e.target.value)} 
                  placeholder="Rua, número, bairro..."
                  style={{ width: '100%', padding: '7px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', height: '50px', boxSizing: 'border-box', fontSize: '13px' }}
                />

                <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>Pagamento:</label>
                <select 
                  value={pagamento} 
                  onChange={(e) => setPagamento(e.target.value)}
                  style={{ width: '100%', padding: '7px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '13px' }}
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartao de Credito">Cartão de Crédito</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>

                {pagamento === 'Cartao de Credito' && (
                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', fontWeight: 'bold', color: '#333' }}>Parcelas:</label>
                    <select 
                      value={parcelas} 
                      onChange={(e) => setParcelas(e.target.value)}
                      style={{ width: '100%', padding: '7px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '13px' }}
                    >
                      <option value="1x">1x (À vista)</option>
                      <option value="2x">2x</option>
                      <option value="3x">3x</option>
                      <option value="4x">4x</option>
                      <option value="5x">5x</option>
                      <option value="6x">6x</option>
                      <option value="7x">7x</option>
                      <option value="8x">8x</option>
                      <option value="9x">9x</option>
                      <option value="10x">10x</option>
                      <option value="11x">11x</option>
                      <option value="12x">12x</option>
                    </select>
                  </div>
                )}

                <button 
                  onClick={finalizarCompraWhatsApp}
                  style={{ background: '#25D366', color: '#fff', border: 'none', padding: '11px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '14px' }}
                >
                  Finalizar no WhatsApp 📲
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {carrinhoAbertoMobile && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 2000, display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: '#fff', height: '100%', padding: '20px', boxSizing: 'border-box', overflowY: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, fontSize: '18px', color: '#111' }}>Seu Carrinho</h2>
                <button 
                  onClick={() => setCarrinhoAbertoMobile(false)}
                  style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>

              {carrinho.length === 0 ? (
                <p style={{ color: '#666' }}>O carrinho está vazio.</p>
              ) : (
                <div>
                  <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
                    {carrinho.map((item, index) => (
                      <li key={index} style={{ marginBottom: '10px', fontSize: '13px', borderBottom: '1px solid #eee', paddingBottom: '8px' }}>
                        <strong>{item.nome}</strong><br />
                        Tam: {item.tamanhoEscolhido} | Cor: {item.corEscolhida}<br />
                        R$ {Number(item.valor).toFixed(2)}
                        <button onClick={() => removerDoCarrinho(index)} style={{ marginLeft: '10px', color: '#d9534f', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>[Remover]</button>
                      </li>
                    ))}
                  </ul>

                  <h3 style={{ borderTop: '1px solid #eee', paddingTop: '10px', color: '#111' }}>Total: R$ {calcularTotal()}</h3>

                  <div style={{ marginTop: '15px' }}>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Seu Nome:</label>
                    <input 
                      type="text" 
                      value={nomeCliente} 
                      onChange={(e) => setNomeCliente(e.target.value)} 
                      placeholder="Nome completo"
                      style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    />

                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Seu Endereço:</label>
                    <textarea 
                      value={enderecoCliente} 
                      onChange={(e) => setEnderecoCliente(e.target.value)} 
                      placeholder="Rua, número, bairro..."
                      style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', height: '50px', boxSizing: 'border-box' }}
                    />

                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Pagamento:</label>
                    <select 
                      value={pagamento} 
                      onChange={(e) => setPagamento(e.target.value)}
                      style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    >
                      <option value="Pix">Pix</option>
                      <option value="Cartao de Credito">Cartão de Crédito</option>
                      <option value="Dinheiro">Dinheiro</option>
                    </select>

                    {pagamento === 'Cartao de Credito' && (
                      <div style={{ marginBottom: '10px' }}>
                        <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Parcelas:</label>
                        <select 
                          value={parcelas} 
                          onChange={(e) => setParcelas(e.target.value)}
                          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                        >
                          <option value="1x">1x (À vista)</option>
                          <option value="2x">2x</option>
                          <option value="3x">3x</option>
                          <option value="4x">4x</option>
                          <option value="5x">5x</option>
                          <option value="6x">6x</option>
                          <option value="7x">7x</option>
                          <option value="8x">8x</option>
                          <option value="9x">9x</option>
                          <option value="10x">10x</option>
                          <option value="11x">11x</option>
                          <option value="12x">12x</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {carrinho.length > 0 && (
              <button 
                onClick={finalizarCompraWhatsApp}
                style={{ background: '#25D366', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '15px', marginTop: '15px' }}
              >
                Finalizar no WhatsApp 📲
              </button>
            )}

          </div>
        </div>
      )}

      {imagemExpandida && (
        <div 
          onClick={() => setImagemExpandida(null)}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(0,0,0,0.85)', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            zIndex: 9999, 
            cursor: 'pointer' 
          }}
        >
          <div 
            style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', background: '#fff', padding: '10px', borderRadius: '8px' }} 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={imagemExpandida} 
              alt="Tênis Ampliado" 
              style={{ display: 'block', maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: '4px', margin: '0 auto' }} 
            />
            <button 
              onClick={() => setImagemExpandida(null)}
              style={{ 
                position: 'absolute', 
                top: '-10px', 
                right: '-10px', 
                background: '#000', 
                color: '#fff', 
                border: '2px solid #fff', 
                borderRadius: '50%', 
                width: '32px', 
                height: '32px', 
                fontSize: '14px', 
                fontWeight: 'bold', 
                cursor: 'pointer', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0,0,0,0.3)'
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;