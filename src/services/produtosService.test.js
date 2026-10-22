import { getProdutos, readLocalProdutos, salvarProduto, writeLocalProdutos } from './produtosService';

jest.mock('../lib/supabase', () => ({ supabase: null }));

describe('produtosService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('cria a lista padrão quando não existe nenhum produto salvo', () => {
    const produtos = readLocalProdutos();

    expect(Array.isArray(produtos)).toBe(true);
    expect(produtos.length).toBeGreaterThan(0);
    expect(produtos[0]).toHaveProperty('nome');
  });

  test('salva e lê os produtos no localStorage', () => {
    const lista = [{
      id: 99,
      nome: 'Produto teste',
      marca: 'Marca Teste',
      valor: 199.9,
      genero: 'Masculino',
      tamanhos: [39, 40],
      cores: ['Preto'],
      observacao: 'Teste automatizado',
      imagens: ['https://example.com/teste.jpg']
    }];

    writeLocalProdutos(lista);
    const produtos = readLocalProdutos();

    expect(produtos).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 99, nome: 'Produto teste' })
    ]));
  });

  test('adiciona um novo produto local sem apagar os existentes', async () => {
    const existentes = [{ id: 10, nome: 'Tênis existente', valor: 100 }];
    writeLocalProdutos(existentes);

    await salvarProduto({ id: 11, nome: 'Tênis novo', valor: 200 }, existentes);

    expect(readLocalProdutos()).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 10, nome: 'Tênis existente' }),
      expect.objectContaining({ id: 11, nome: 'Tênis novo' })
    ]));
  });

  test('mantém dois novos produtos publicados em sequência', async () => {
    const primeiro = await salvarProduto({ nome: 'Primeiro tênis', valor: 200 }, []);
    const segundo = await salvarProduto({ nome: 'Segundo tênis', valor: 250 }, [primeiro]);
    const produtos = readLocalProdutos();

    expect(segundo.id).not.toBe(primeiro.id);
    expect(produtos).toEqual(expect.arrayContaining([
      expect.objectContaining({ nome: 'Primeiro tênis' }),
      expect.objectContaining({ nome: 'Segundo tênis' })
    ]));
  });
});
