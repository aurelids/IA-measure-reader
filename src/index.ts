import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import routes from './routes/routes';

const app = express();

// Ajuste o limite de payload para 10mb ou o valor que você precisar
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware para servir arquivos estáticos do diretório temp
app.use('/temp', express.static(path.join(__dirname, 'temp')));

// Use as rotas importadas
app.use('/api/measures', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Conecte ao banco de dados MongoDB usando a string de conexão correta
mongoose.connect('mongodb+srv://gabrielaurelio33:shopper2024@cluster0.tlr8y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
