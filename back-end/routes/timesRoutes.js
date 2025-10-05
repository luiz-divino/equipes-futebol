// 1. Importe o Express
const express = require('express');

const router = express.Router();


router.get('/:nomeDoTime', async (req, res) => {
  const { nomeDoTime } = req.params;
  const apiKey = process.env.SPORTS_API_KEY;

  const urlExterna = `https://www.thesportsdb.com/api/v1/json/${apiKey}/searchteams.php?t=${nomeDoTime}`;

  try {
    const response = await fetch(urlExterna);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Erro na rota de times:', error);
    res.status(500).json({ message: 'Falha ao buscar dados do time.' });
  }

});

router.post('/', async (req, res) => {
  res.status(201).send('Time salvo com sucesso!');
});


module.exports = router;