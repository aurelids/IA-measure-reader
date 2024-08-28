import { Router } from 'express';
import { confirm } from '../controllers/confirmController';
import { list } from '../controllers/listController';
import { uploadMeasure } from '../controllers/uploadController';

const router = Router();

// Definir rota para upload
router.post('/upload', uploadMeasure); // Certifique-se de que a rota está correta

// Definir rotas para confirmação
router.patch('/confirm', confirm);

// Definir rotas para listar medições
router.get('/:customer_code/list', list);

export default router;
