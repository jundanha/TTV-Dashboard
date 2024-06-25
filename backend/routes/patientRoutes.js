import express from 'express';
import patient from '../models/patient.js';
import ttv from '../models/ttv.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const patientValidationRules = [
  body('name').isString().notEmpty().withMessage('Name is required'),
  body('age').isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other'),
  body('contact').isString().notEmpty().withMessage('Contact is required'),
  body('address').isString().notEmpty().withMessage('Address is required'),
];

const patientUpdateValidationRules = [
  body('name').isString().optional(),
  body('age').isInt({ min: 0 }).optional().withMessage('Age must be a non-negative integer'),
  body('gender').isIn(['Male', 'Female', 'Other']).optional().withMessage('Gender must be Male, Female, or Other'),
  body('contact').isString().optional(),
  body('address').isString().optional()
];

router.get('/getall', async (req, res) => {
  try {
    const patients = await patient.find();
    res.json(patients);
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      message: error.message 
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const selectedpatient = await patient.findById(req.params.id);
    const ttvs = await ttv.find({ patient: req.params.id });
    res.json({ 
      patient: selectedpatient, 
      ttvs 
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ 
      message: error.message 
    });
  }
});

router.post('/new', patientValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ 
      errors: errors.array() 
    });
  }

  const { name, age, gender, contact, address } = req.body;

  try {
    const newPatient = new patient({
      name,
      age,
      gender,
      contact,
      address,
    });
    const savedpatient = await newPatient.save();
    res.status(201).json({
      patient: savedpatient
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ 
      message: error.message 
    });
  }
});

router.put('/update/:id', patientUpdateValidationRules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return res.status(400).json({ 
      errors: errors.array() 
    });
  }

  const { name, age, gender, contact, address } = req.body;

  try {
    const updatedPatient = await patient.findByIdAndUpdate(req.params.id, {
      name,
      age,
      gender,
      contact,
      address,
      updatedAt: Date.now(),
    }, { new: true });

    res.json(updatedPatient);
  } catch (error) {
    console.log(error);
    res.status(400).json({ 
      message: error.message 
    });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    const deletedPatient = await patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) {
      console.log('Patient not found');
      return res.status(404).json({ 
        message: 'Patient not found' 
      });
    }
    const deletedTtvs = await ttv.deleteMany({ patient: req.params.id });
    res.json({ patient: deletedPatient, ttvs: deletedTtvs });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
      message: error.message 
    });
  }
});

export default router;