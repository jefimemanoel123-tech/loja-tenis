import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'ms_produtos';

export const produtosSeed = [
  {
    id: 1,
    nome: 'Tênis Nike Air Force 1',
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
    nome: 'Tênis Adidas Superstar',
    marca: 'Adidas',
    valor: 320.0,
    genero: 'Feminino',
    tamanhos: [37, 38, 39, 40],
    cores: ['Branco/Preto', 'Total Black'],
    observacao: 'Cupom: MS10',
    imagens: ['https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=500']
  }
];

const normalizarProduto = (produto = {}) => {
  const imagens = Array.isArray(produto.imagens)
    ? produto.imagens.filter(Boolean)
    : produto.imagem
      ? [produto.imagem]
      : [];

  const tamanhos = Array.isArray(produto.tamanhos)
    ? produto.tamanhos.map((t) => String(t).trim()).filter(Boolean)
    : [];

  const cores = Array.isArray(produto.cores)
    ? produto.cores.map((c) => String(c).trim()).filter(Boolean)
    : [];

  return {
    id: Number(produto.id ?? Date.now()),
    nome: produto.nome || 'Produto sem nome',
    marca: produto.marca || '',
    valor: Number(produto.valor || 0),
    genero: produto.genero || 'Unissex',
    tamanhos,
    cores,
    observacao: produto.observacao || '',
    imagens: imagens.length > 0 ? imagens : ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500']
  };
};

const normalizarListaProdutos = (lista) => {
  if (!Array.isArray(lista)) return [];
  return lista.map((produto) => normalizarProduto(produto));
};

export const readLocalProdutos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(produtosSeed));
      return produtosSeed;
    }

    const lista = JSON.parse(raw);
    const normalizada = normalizarListaProdutos(lista);
    return normalizada.length > 0 ? normalizada : produtosSeed;
  } catch {
    return produtosSeed;
  }
};

export const writeLocalProdutos = (lista) => {
  try {
    const normalizada = normalizarListaProdutos(lista);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizada));
    return normalizada;
  } catch {
    return lista || [];
  }
};

export const getProdutos = async () => {
  if (!supabase) {
    return readLocalProdutos();
  }

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return normalizarListaProdutos(data || []);
};

export const salvarProduto = async (produto, produtosLocais = []) => {
  if (!supabase) {
    const maiorIdExistente = produtosLocais.reduce(
      (maiorId, item) => Math.max(maiorId, Number(item.id) || 0),
      0
    );
    const produtoComId = { ...produto, id: produto.id ?? Math.max(Date.now(), maiorIdExistente + 1) };
    const produtoNormalizado = normalizarProduto(produtoComId);
    const produtoJaExiste = produtosLocais.some((item) => item.id === produtoNormalizado.id);
    const listaAtualizada = produtoJaExiste
      ? produtosLocais.map((item) => item.id === produtoNormalizado.id ? produtoNormalizado : item)
      : [produtoNormalizado, ...produtosLocais];
    writeLocalProdutos(listaAtualizada);
    return produtoNormalizado;
  }

  const query = produto.id
    ? supabase.from('products').update(produto).eq('id', produto.id)
    : supabase.from('products').insert(produto);
  const { data, error } = await query.select().single();

  if (error) {
    throw error;
  }

  return normalizarProduto(data);
};

export const excluirProduto = async (id, produtosLocais = []) => {
  if (!supabase) {
    const listaAtualizada = produtosLocais.filter((produto) => produto.id !== id);
    writeLocalProdutos(listaAtualizada);
    return listaAtualizada;
  }

  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    throw error;
  }

  return true;
};
