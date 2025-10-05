const express = require('express');
const router = express.Router();

router.get('/:termo', async (req, res) => {
  const { termo } = req.params;

  const apiKey = process.env.NEWS_API_KEY;

  const urlExterna = `https://newsapi.org/v2/everything?q=${termo}&apiKey=${apiKey}`; 

  try {
    const response = await fetch(urlExterna);
    const data = await response.json();

    res.json(data.articles); 

  } catch (error) {
    console.error('Erro na rota de notícias:', error);
    res.status(500).json({ message: 'Falha interna ao buscar notícias.' });
  }
});

module.exports = router;