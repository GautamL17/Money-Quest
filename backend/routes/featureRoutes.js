import express from 'express';
import {getFeatures,addFeature,deleteFeature,toggleFeature} from '../controllers/featureController.js';

const router = express.Router();

router.get('/',getFeatures);
router.post('/',addFeature);
router.patch('/:id/toggle',toggleFeature);
router.delete('/:id',deleteFeature);

export default router;
