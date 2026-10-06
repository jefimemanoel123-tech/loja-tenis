import React, { useState, useEffect } from 'react';
import LogoMs from '../assets/Logo-ms.png';

function Home() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [nomeCliente, setNomeCliente] = useState('');
  const [enderecoCliente, setEnderecoCliente] = useState('');
  const [pagamento, setPagamento] = useState('Pix');
  const [parcelas, setParcelas] = useState('1x');

  const [tamanhoSelecionado, setTamanhoSelecionado] = useState({});
  const [corSelecionada, setCorSelecionada] = useState({});
  const [indiceFoto, setIndiceFoto] = useState({});
  const [imagemExpandida, setImagemExpandida] = useState(null); // Estado para o modal de zoom da foto

  useEffect(() => {
    const produtosSalvos = JSON.parse(localStorage.getItem('ms_produtos')) || [
      { 
        id: 1, 
        nome: 'Tenis Nike Air Force 1', 
        marca: 'Nike', 
        valor: 350.00, 
        tamanhos: [38, 39, 40, 41, 42], 
        cores: ['Branco', 'Preto/Branco'], 
        imagens: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'] 
      },
      { 
        id: 2, 
        nome: 'Tenis Adidas Superstar', 
        marca: 'Adidas', 
        valor: 320.00, 
        tamanhos: [37, 38, 39, 40], 
        cores: ['Branco/Preto', 'Total Black'], 
        imagens: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500'] 
      }
    ];
    setProdutos(produtosSalvos);
  }, []);

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

    setCarrinho([...carrinho, itemCarrinho]);
    alert(`${produto.nome} (Tam: ${tamanhoEscolhido}, Cor: ${corEscolhida}) adicionado ao carrinho!`);
  };

  const removerDoCarrinho = (indexParaRemover) => {
    setCarrinho(carrinho.filter((_, index) => index !== indexParaRemover));
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => total + item.valor, 0).toFixed(2);
  };

  const finalizarCompraWhatsApp = () => {
    if (carrinho.length === 0) {
      alert('O seu carrinho esta vazio!');
      return;
    }
    if (!nomeCliente || !enderecoCliente) {
      alert('Por favor, preencha seu nome e endereco antes de finalizar.');
      return;
    }

    let mensagem = `*Novo Pedido - MS Store*\n\n`;
    mensagem += `*Cliente:* ${nomeCliente}\n`;
    mensagem += `*Endereco:* ${enderecoCliente}\n`;
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

    const numeroWhatsApp = '5531993438501'; 
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', minHeight: '100vh', paddingBottom: '40px' }} translate="yes">
      
      {/* Cabeçalho */}
      <header style={{ background: '#111', color: '#fff', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <img src={LogoMs} alt="MS Store Logo" style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fff' }} />
          <h1 style={{ fontSize: '22px', margin: '0', letterSpacing: '1px' }}><span translate="no">MS STORE</span></h1>
        </div>
        <div style={{ background: '#333', padding: '8px 15px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }} translate="no">
          Carrinho: {carrinho.length} item(ns)
        </div>
      </header>

      {/* Conteúdo */}
      <div style={{ maxWidth: '1200px', margin: '30px auto', padding: '0 20px', display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        
        {/* Catálogo */}
        <div style={{ flex: '2', minWidth: '300px' }}>
          <h2 style={{ marginBottom: '20px', color: '#222', borderBottom: '2px solid #ddd', paddingBottom: '10px' }}>Lancamentos Disponiveis</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {produtos.map((produto) => {
              const listaImagens = produto.imagens && produto.imagens.length > 0 ? produto.imagens : [produto.imagem || 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500'];
              const indiceAtual = indiceFoto[produto.id] || 0;
              const fotoExibida = listaImagens[indiceAtual];

              return (
                <div key={produto.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '15px', textAlign: 'left', background: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  
                  {/* Container da Imagem com Carrossel e clique para Zoom */}
                  <div 
                    onClick={() => setImagemExpandida(fotoExibida)}
                    style={{ position: 'relative', width: '100%', height: '160px', marginBottom: '10px', cursor: 'pointer' }}
                    title="Clique para ampliar a foto"
                  >
                    <img src={fotoExibida} alt={produto.nome} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }} />
                    
                    {listaImagens.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => fotoAnterior(produto.id, listaImagens.length, e)}
                          style={{ position: 'absolute', left: '5px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          ‹
                        </button>
                        <button 
                          onClick={(e) => proximaFoto(produto.id, listaImagens.length, e)}
                          style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: '#fff', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', fontWeight: 'bold' }}
                        >
                          ›
                        </button>
                        <div style={{ position: 'absolute', bottom: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                          {indiceAtual + 1}/{listaImagens.length}
                        </div>
                      </>
                    )}
                    <div style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>
                      🔍 Ampliar
                    </div>
                  </div>

                  <h3 style={{ fontSize: '16px', margin: '10px 0 5px 0', color: '#111' }}>{produto.nome}</h3>
                  <p style={{ color: '#666', margin: '0 0 10px 0', fontSize: '14px' }}>{produto.marca}</p>
                  <p style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 10px 0', color: '#000' }}>R$ {Number(produto.valor).toFixed(2)}</p>
                  
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', color: '#444' }}>Tamanho:</label>
                    <select 
                      onChange={(e) => handleTamanhoChange(produto.id, e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
                    >
                      {produto.tamanhos && produto.tamanhos.map((tam) => (
                        <option key={tam} value={tam}>{tam}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold', display: 'block', color: '#444' }}>Cor:</label>
                    <select 
                      onChange={(e) => handleCorChange(produto.id, e.target.value)}
                      style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px' }}
                    >
                      {produto.cores && produto.cores.map((cor) => (
                        <option key={cor} value={cor}>{cor}</option>
                      ))}
                    </select>
                  </div>

                  <button 
                    onClick={() => adicionarAoCarrinho(produto)}
                    style={{ background: '#000', color: '#fff', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold', transition: 'background 0.2s' }}
                    translate="no"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carrinho / Checkout */}
        <div style={{ flex: '1', minWidth: '300px', background: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', height: 'fit-content', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h2 style={{ marginTop: '0', color: '#111', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Seu Carrinho</h2>
          {carrinho.length === 0 ? (
            <p style={{ color: '#666' }}>O carrinho esta vazio.</p>
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

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Seu Nome:</label>
                <input 
                  type="text" 
                  value={nomeCliente} 
                  onChange={(e) => setNomeCliente(e.target.value)} 
                  placeholder="Digite seu nome completo"
                  style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />

                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Seu Endereço (para calculo de frete):</label>
                <textarea 
                  value={enderecoCliente} 
                  onChange={(e) => setEnderecoCliente(e.target.value)} 
                  placeholder="Rua, numero, bairro, cidade..."
                  style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', height: '60px', boxSizing: 'border-box' }}
                />

                <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Forma de Pagamento:</label>
                <select 
                  value={pagamento} 
                  onChange={(e) => setPagamento(e.target.value)}
                  style={{ width: '100%', padding: '8px', marginBottom: '15px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartao de Credito">Cartao de Credito</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>

                {pagamento === 'Cartao de Credito' && (
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', fontSize: '13px', marginBottom: '5px', fontWeight: 'bold', color: '#333' }}>Quantidade de Parcelas:</label>
                    <select 
                      value={parcelas} 
                      onChange={(e) => setParcelas(e.target.value)}
                      style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                    >
                      <option value="1x">1x (A vista)</option>
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
                  style={{ background: '#25D366', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '15px' }}
                >
                  Finalizar no WhatsApp 📲
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Modal para Ampliar a Imagem (Zoom) */}
      {imagemExpandida && (
        <div 
          onClick={() => setImagemExpandida(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, cursor: 'pointer' }}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%' }} onClick={(e) => e.stopPropagation()}>
            <img src={imagemExpandida} alt="Tênis Ampliado" style={{ width: '100%', maxHeight: '85vh', objectFit: 'contain', borderRadius: '8px', background: '#fff' }} />
            <button 
              onClick={() => setImagemExpandida(null)}
              style={{ position: 'absolute', top: '-15px', right: '-15px', background: '#000', color: '#fff', border: '2px solid #fff', borderRadius: '50%', width: '35px', height: '35px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
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