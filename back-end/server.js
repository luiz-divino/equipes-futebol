// 1. Carrega as variáveis do .env para process.env
require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors'); // Garanta que esta linha existe

// 2. Acessa as variáveis carregadas
const apiKey = process.env.SPORTS_API_KEY;
const dbUser = process.env.DB_USER;
const port = process.env.PORT || 3001; // Boa prática: usar variável para porta também

app.use(cors());

// 3. Usa as variáveis na sua lógica
console.log(`Conectando ao banco de dados como usuário: ${dbUser}`);


  app.get('/api/time/:nomeDoTime', async (req, res) => {
  const { nomeDoTime } = req.params;
  // Usando a chave de API de forma segura
  const urlExterna = `https://www.thesportsdb.com/api/v1/json/${apiKey}/searchteams.php?t=${nomeDoTime}`;

  try {
    const response = await fetch(urlExterna);
    const data = await response.json();

    res.json(data);

  } catch (error) {
    console.error('Erro ao buscar dados da API externa:', error)
    res.status(500).json({ message: 'Falha ao buscar dados do time.' })
  }

});



app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});