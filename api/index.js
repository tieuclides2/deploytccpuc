const express = require('express');
const { Client } = require("pg");
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Configuração do middleware CORS
const corsOptions = {
  origin: '*', // Permite todas as origens. Altere para um domínio específico se necessário.
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Adicionar cabeçalhos CORS manualmente
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permite todas as origens
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS'); // Permite esses métodos
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Permite esses cabeçalhos
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Rotas

app.get('/', (req, res) => {
  res.json("funcionou")
});

// Obter todos os projetos
app.get('/projetos', async (req, res) => {
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('SELECT projetos.*, category.name as name_category FROM projetos LEFT JOIN category ON category.id = projetos.idcategory');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.end();
  }
});

app.get('/categorias', async (req, res) => {
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM category');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.end();
  }
});

app.get('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM projetos WHERE id = $1', [id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.end();
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM "user" WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error("Error executing query:", err);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await client.end();
  }
});

// Adicionar as outras rotas de maneira semelhante...

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
