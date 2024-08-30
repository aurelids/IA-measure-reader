import { Router } from 'express';
import { confirm } from '../controllers/confirmController';
import { list } from '../controllers/listController';
import { uploadMeasureController } from '../controllers/uploadController'; 

const router = Router();

router.post('/upload', uploadMeasureController); 

router.patch('/confirm', confirm);

router.get('/:customer_code/list', list);

export default router;
