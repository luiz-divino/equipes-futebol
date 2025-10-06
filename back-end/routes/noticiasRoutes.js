const express = require('express');
const router = express.Router();

router.get('/:termo', async (req, res) => {
  const { termo } = req.params;

  console.log('Termo recebido do frontend:', termo);

  const termoDeBusca = `${termo} AND futebol`;

  const apiKey = process.env.NEWS_API_KEY;
  console.log('PISTA 3: Chave de API carregada:', apiKey);

  const urlExterna = `https://newsapi.org/v2/everything?q=${encodeURIComponent(termoDeBusca)}&apiKey=${apiKey}`;
  console.log('URL final enviada:', urlExterna);

  try {
    const response = await fetch(urlExterna);
    const data = await response.json();

    const artigos = data.articles || [];

    console.log(`Encontrados ${artigos.length} artigos.`)


    // Filtrar notícias relacionadas a futebol
    const palavrasChaveFutebol = [
      'futebol', 'gol', 'campeonato', 'jogador', 'escalação', 'partida',
      'jogo', 'clube', 'vitória', 'derrota', 'estádio', 'brasileirão',
      'libertadores', 'copa', 'técnico', 'transferência', 'goleiro', 'atacante'
    ];

    const artigosFutebol = artigos.filter(artigo => {
      const titulo = (artigo.title || '').toLowerCase();
      const descricao = (artigo.description || '').toLowerCase();

      return palavrasChaveFutebol.some(palavra => titulo.includes(palavra) || descricao.includes(palavra));
    });

    res.json(artigosFutebol);

  } catch (error) {
    console.error('Erro na rota de notícias:', error);
    res.status(500).json({ message: 'Falha interna ao buscar notícias.' });
  }
});

module.exports = router;