import express from 'express';
import ttv from '../models/ttv.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const ttvValidationRules = [
  body('type')
    .isIn(['Blood Pressure', 'Pulse', 'Respiration Rate', 'Body Temperature'])
    .withMessage('Type must be Blood Pressure, Pulse, Respiration Rate, or Body Temperature'),

  body('value')
    .custom((value, { req }) => {
      if (req.body.type === 'Blood Pressure') {
        if (typeof value !== 'object' || value === null) {
          throw new Error('Value must be an object with systolic and diastolic for Blood Pressure');
        }
        if (typeof value.systolic !== 'number' || typeof value.diastolic !== 'number') {
          throw new Error('Systolic and diastolic values must be numbers');
        }
      } else {
        if (typeof value !== 'number') {
          throw new Error('Value must be a number');
        }
      }
      return true;
    }),

  body('detectionSite')
    .if(body('type').equals('Pulse'))
    .isIn(['Arteri radialis', 'Arteri brakialis', 'Arteri karotis', 'Arteri poplitea', 'Arteri dorsalis pedis'])
    .withMessage('Detection Site must be Arteri radialis, Arteri brakialis, Arteri karotis, Arteri poplitea, or Arteri dorsalis pedis')
];

router.post('/new', ttvValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ 
      errors: errors.array() 
    });
  }

  const { patient, type, value, detectionSite } = req.body;

  let unit;

  switch (type) {
    case 'Blood Pressure':
      unit = 'mmHg';
      break;
    case 'Pulse':
      unit = 'bpm';
      break;
    case 'Respiration Rate':
      unit = 'breaths per minute';
      break;
    case 'Body Temperature':
      unit = '°C';
      break;
    default:
      unit = '';
  }

  try {
    const newTtv = new ttv({
      patient,
      type,
      value,
      detectionSite,
      unit,
    });
    const savedTtv = await newTtv.save();
    res.status(201).json(savedTtv);
  } catch (error) {
    console.log(error);
    res.status(400).json({ 
      message: error.message 
    });
  }
});

router.delete('/delete/:ttvId', async (req, res) => {
  const ttvId = req.params.ttvId;

  try {
    const ttvRecord = await ttv.findOneAndDelete({ _id: ttvId });
    if (!ttvRecord) {
      console.log('TTV record not found');
      return res.status(404).json({ 
        message: 'TTV record not found' 
      });
    }

    res.json({ message: 'TTV record deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      message: error.message 
    });
  }
});

export default router;
