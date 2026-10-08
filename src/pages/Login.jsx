import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoMs from '../assets/Logo-ms.png';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (email === 'emanuelej.silva@hotmail.com' && senha === 'Emanuele123@') {
      localStorage.setItem('ms_admin_logado', 'true');
      navigate('/admin');
    } else {
      alert('E-mail ou senha incorretos!');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f5f5f5', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ background: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        
        <img src={LogoMs} alt="MS Store Logo" style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #111', marginBottom: '20px' }} />
        <h2 style={{ marginBottom: '20px', color: '#111' }}>Painel MS Store</h2>
        
        <form onSubmit={handleLogin}>
          <div style={{ textAlign: 'left', marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>E-mail de Acesso:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="emanuelej.silva@hotmail.com"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '5px' }}>Senha:</label>
            <input 
              type="password" 
              value={senha} 
              onChange={(e) => setSenha(e.target.value)} 
              placeholder="********"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit"
            style={{ background: '#000', color: '#fff', border: 'none', padding: '12px', borderRadius: '5px', cursor: 'pointer', width: '100%', fontWeight: 'bold', fontSize: '15px' }}
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;