import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  window.history.pushState({}, '', '/');
});

test('renderiza a página inicial da loja', () => {
  render(<App />);

  expect(screen.getByText(/MS Store/i)).toBeInTheDocument();
});

test('permite fazer login com as credenciais do admin', () => {
  window.history.pushState({}, '', '/login');
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText('emanuelej.silva@hotmail.com'), {
    target: { value: 'emanuelej.silva@hotmail.com' },
  });

  fireEvent.change(screen.getByPlaceholderText('********'), {
    target: { value: 'Emanuele123@' },
  });

  fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }));

  expect(localStorage.getItem('ms_admin_logado')).toBe('true');
});

test('bloqueia login quando a senha está incorreta', () => {
  const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

  window.history.pushState({}, '', '/login');
  render(<App />);

  fireEvent.change(screen.getByPlaceholderText('emanuelej.silva@hotmail.com'), {
    target: { value: 'emanuelej.silva@hotmail.com' },
  });

  fireEvent.change(screen.getByPlaceholderText('********'), {
    target: { value: 'senha-errada' },
  });

  fireEvent.click(screen.getByRole('button', { name: /entrar no painel/i }));

  expect(alertSpy).toHaveBeenCalledWith('E-mail ou senha incorretos!');
  alertSpy.mockRestore();
});
