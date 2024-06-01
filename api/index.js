const express = require('express');
const mysql = require('mysql');
const { Client } = require("pg");
const bodyParser = require('body-parser');

const cors = require('cors');

const corsOptions = {
  origin: 'https://deployfrontendtcc.vercel.app/',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};


const app = express();
const port = 3000;
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://deployfrontendtcc.vercel.app/");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true");
    next();
});

// Configuração do MySQL
// const connection = mysql.createConnection({
//   host: 'deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud',
//   port: '26257',
//   user: 'tcc_puc',
//   password: 'HrmmTM8fgGIQHfw9EWdIVg',
//   database: 'defaultdb'
// });

//const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");

// (async () => {
//   await client.connect();
//   try {
//     const results = await client.query("SELECT NOW()");
//     console.log('certo');
//   } catch (err) {
//     console.error("error executing query:", err);
//   } finally {
//     client.end();
//   }
// })();

// Conectar ao MySQL
// connection.connect(err => {
//   if (err) {
//     console.error('Erro ao conectar ao MySQL:', err);
//     return;
//   }
//   console.log('Conectado ao MySQL');
// });

// Middleware para análise do corpo das requisições
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rotas

app.get('/', (req, res) => {
  res.json("funcionou")
})

// Obter todos os projetos
app.get('/projetos', async (req, res) => {
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('SELECT projetos.*, category.name as name_category FROM projetos left join category on category.id =  projetos.idcategory');
    res.status(200).json(result.rows)
  }
  finally {
    client.end()
  }

  // connection.query('SELECT projetos.*, category.name as name_category FROM projetos inner join category on category.id =  projetos.idcategory', (err, rows) => {
  //   if (err) throw err;
  //   res.json(rows);
  // });
});

app.get('/categorias', async (req, res) => {
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM category');
    res.status(200).json(result)
  }
  finally {
    client.end()
  }


  //   connection.query('SELECT * FROM category', (err, rows) => {
  //   if (err) throw err;
  //   res.json(rows);
  // });
});

// Obter um projeto específico por ID

app.get('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");

  try {
    await client.connect();
    const result = await client.query('SELECT * FROM projetos WHERE projetos.id = ?', id);
    res.status(200).json(result)
  }
  finally {
    client.end()
  }



  // connection.query('SELECT * FROM projetos WHERE projetos.id = ?', id, (err, rows) => {
  //   if (err) throw err;
  //   res.json(rows[0]);
  // });
});

// logar

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM user WHERE name = ? and password = ?', [email, password]);
    res.status(200).json(result)

  }
  finally {
    client.end()
  }

  // connection.query('SELECT * FROM user WHERE name = ? and password = ?', [email, password], (err, rows) => {
  //   if (err) throw err;
  //   res.json(rows[0]);
  // });
});

app.get('/services/:id', async (req, res) => {
  const { id } = req.params;
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('SELECT * FROM services where idproject = ?', id);
    res.status(200).json(result)
  }
  finally {
    client.end()
  }

// connection.query('SELECT * FROM services where idproject = ?', id, (err, rows) => {
  //   if (err) throw err;
  //   res.json(rows);
  // });
});

// Criar um novo projeto
app.post('/projetos', async (req, res) => {
  const { name, budget, idcategory } = req.body;
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('INSERT INTO projetos (name, budget, idcategory) VALUES (?, ?, ?)', [name, budget, idcategory]);
    res.status(200).json(result)
  }
  finally {
    client.end()
  }



  // connection.query('INSERT INTO projetos (name, budget, idcategory) VALUES (?, ?, ?)', [name, budget, idcategory], (err, result) => {
  //   if (err) throw err;
  //   res.send('Projeto criado com sucesso');
  // });
});

//criar nova categoria
app.post('/newcategory', async (req, res) => {
  const { name } = req.body;
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('INSERT INTO category (name) VALUES (?)', [name]);
    res.status(200).json(result)
  }
  finally {
    client.end()
  }


  // connection.query('INSERT INTO category (name) VALUES (?)', [name], (err, result) => {
  //   if (err) throw err;
  //   res.send('Categoria criada com sucesso');
  // });
});

app.post('/services', async (req, res) => {
  const { name, description, cost, idproject } = req.body;
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('INSERT INTO services (name, description, cost, idproject) VALUES (?, ?, ?, ?)', [name, description, cost, idproject]);
    res.status(200).json(result)
  }
  finally {
    client.end()
  }


  // console.log(req.body)
  // connection.query('INSERT INTO services (name, description, cost, idproject) VALUES (?, ?, ?, ?)', [name, description, cost, idproject], (err, result) => {
  //   if (err) throw err;
  //   res.send('Serviço criado com sucesso');
  // });
});

// efetuar cadastro 
app.post('/user', async (req, res) => {
  const { name, email, password } = req.body;
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    console.log(req.body)
    await client.connect();
    const result = await client.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, password]);
    res.status(200).json(result)
  }
  finally {
    client.end()
  }



  // connection.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
  //   if (err) throw err;
  //   res.send('Usuario criado com sucesso!');
  // });
});

// Atualizar um projeto existente
app.put('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, orcamento, categoria } = req.body;

  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('UPDATE projetos SET nome = ?, orcamento = ?, categoria = ? WHERE id = ?', [nome, orcamento, categoria, id]);
    res.status(200).json(result)
  }
  finally {
    client.end()
  }



  // connection.query('UPDATE projetos SET nome = ?, orcamento = ?, categoria = ? WHERE id = ?', [nome, orcamento, categoria, id], (err, result) => {
  //   if (err) throw err;
  //   res.send('Projeto atualizado com sucesso');
  // });
});

// Excluir um projeto existente
app.delete('/projetos/:id', async (req, res) => {
  const { id } = req.params;

  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('DELETE FROM projetos WHERE id = ?', id);
    res.status(200).json(result)
  }
  finally {
    client.end()
  }


  // connection.query('DELETE FROM projetos WHERE id = ?', id, (err, result) => {
  //   if (err) throw err;
  //   res.send('Projeto excluído com sucesso');
  // });
});

// Excluir serviço
app.delete('/services/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const client = new Client("postgresql://tcc_puc:HrmmTM8fgGIQHfw9EWdIVg@deploy-puctcc-2280.g8x.gcp-southamerica-east1.cockroachlabs.cloud:26257/defaultdb?sslmode=verify-full");
  try {
    await client.connect();
    const result = await client.query('DELETE FROM services WHERE id = ?', id);
    res.status(200).json(result)
  }
  finally {
    client.end()
  }

  // connection.query('DELETE FROM services WHERE id = ?', id, (err, result) => {
  //   if (err) throw err;
  //   res.send('Projeto excluído com sucesso');
  // });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
