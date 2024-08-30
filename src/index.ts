import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import router from './routes/routes';

const app = express();


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use('/temp', express.static(path.join(__dirname, 'temp')));


app.use('/', router);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


mongoose.connect('mongodb+srv://gabrielaurelio33:shopper2024@cluster0.tlr8y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));
