require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

// IMPORTAR OS ARQUIVOS DE ROTAS
const timesRoutes = require('./routes/timesRoutes');
const noticiasRoutes = require('./routes/noticiasRoutes'); 

// Middlewares
app.use(cors());
app.use(express.json());


app.use('/api/times', timesRoutes);
app.use('/api/noticias', noticiasRoutes);


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});