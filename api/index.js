const express = require('express');
const mysql = require('mysql');
const { Client } = require("pg");
const bodyParser = require('body-parser');

const cors = require('cors');
@@ -10,21 +11,36 @@ const port = 3000;
app.use(cors());

// Configuração do MySQL
const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'puc'
});
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
connection.connect(err => {
  if (err) {
    console.error('Erro ao conectar ao MySQL:', err);
    return;
  }
  console.log('Conectado ao MySQL');
});
// connection.connect(err => {
//   if (err) {
//     console.error('Erro ao conectar ao MySQL:', err);
//     return;
//   }
//   console.log('Conectado ao MySQL');
// });

// Middleware para análise do corpo das requisições
app.use(bodyParser.json());
@@ -33,115 +49,252 @@ app.use(bodyParser.urlencoded({ extended: true }));
// Rotas

app.get('/', (req, res) => {
  res.json('Funcionou')
});
  res.json("funcionou")
})

// Obter todos os projetos
app.get('/projetos', (req, res) => {
  connection.query('SELECT projetos.*, category.name as name_category FROM projetos inner join category on category.id =  projetos.idcategory', (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
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

app.get('/categorias', (req, res) => {
  connection.query('SELECT * FROM category', (err, rows) => {
    if (err) throw err;
    res.json(rows);
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
app.get('/projetos/:id', (req, res) => {

app.get('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM projetos WHERE projetos.id = ?', id, (err, rows) => {
    if (err) throw err;
    res.json(rows[0]);
  });
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

app.post('/login', (req, res) => {
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  connection.query('SELECT * FROM user WHERE name = ? and password = ?', [email, password], (err, rows) => {
    if (err) throw err;
    res.json(rows[0]);
  });
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

app.get('/services/:id', (req, res) => {
app.get('/services/:id', async (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM services where idproject = ?', id, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
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
app.post('/projetos', (req, res) => {
app.post('/projetos', async (req, res) => {
  const { name, budget, idcategory } = req.body;
  connection.query('INSERT INTO projetos (name, budget, idcategory) VALUES (?, ?, ?)', [name, budget, idcategory], (err, result) => {
    if (err) throw err;
    res.send('Projeto criado com sucesso');
  });
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
app.post('/newcategory', (req, res) => {
app.post('/newcategory', async (req, res) => {
  const { name } = req.body;
  connection.query('INSERT INTO category (name) VALUES (?)', [name], (err, result) => {
    if (err) throw err;
    res.send('Categoria criada com sucesso');
  });
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

app.post('/services', (req, res) => {
app.post('/services', async (req, res) => {
  const { name, description, cost, idproject } = req.body;
  console.log(req.body)
  connection.query('INSERT INTO services (name, description, cost, idproject) VALUES (?, ?, ?, ?)', [name, description, cost, idproject], (err, result) => {
    if (err) throw err;
    res.send('Serviço criado com sucesso');
  });
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
app.post('/user', (req, res) => {
app.post('/user', async (req, res) => {
  const { name, email, password } = req.body;
  console.log(req.body)
  connection.query('INSERT INTO user (name, email, password) VALUES (?, ?, ?)', [name, email, password], (err, result) => {
    if (err) throw err;
    res.send('Usuario criado com sucesso!');
  });
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
app.put('/projetos/:id', (req, res) => {
app.put('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, orcamento, categoria } = req.body;
  connection.query('UPDATE projetos SET nome = ?, orcamento = ?, categoria = ? WHERE id = ?', [nome, orcamento, categoria, id], (err, result) => {
    if (err) throw err;
    res.send('Projeto atualizado com sucesso');
  });

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
app.delete('/projetos/:id', (req, res) => {
app.delete('/projetos/:id', async (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM projetos WHERE id = ?', id, (err, result) => {
    if (err) throw err;
    res.send('Projeto excluído com sucesso');
  });

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
app.delete('/services/:id', (req, res) => {
app.delete('/services/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  connection.query('DELETE FROM services WHERE id = ?', id, (err, result) => {
    if (err) throw err;
    res.send('Projeto excluído com sucesso');
  });
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
