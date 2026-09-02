const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

let products = [
  {
    id: 1,
    name: 'Produto exemplo',
    description: 'Produto inicial',
    price: 29.90
  }
];

let nextId = 2;

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: 'not required'
  });
});

// Listar produtos
app.get('/api/products', (req, res) => {
  res.json([...products].reverse());
});

// Criar produto
app.post('/api/products', (req, res) => {
  const { name, description, price } = req.body;

  if (
    !name ||
    price === undefined ||
    price === null ||
    Number.isNaN(Number(price))
  ) {
    return res.status(400).json({
      error: 'name e price são obrigatórios e price deve ser numérico'
    });
  }

  const product = {
    id: nextId++,
    name: String(name).trim(),
    description: description
      ? String(description).trim()
      : null,
    price: Number(price)
  };

  products.push(product);

  res.status(201).json(product);
});

// Buscar produto por ID
app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      error: 'id inválido'
    });
  }

  const product = products.find(product => product.id === id);

  if (!product) {
    return res.status(404).json({
      error: 'Produto não encontrado'
    });
  }

  res.json(product);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando na porta ${PORT}`);
});
