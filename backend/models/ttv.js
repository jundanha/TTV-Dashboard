import mongoose from 'mongoose';

const ttvSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  type: {
    type: String,
    enum: ['Blood Pressure', 'Pulse', 'Respiration Rate', 'Body Temperature'],
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  // status: {
  //   type: String,
  //   enum: ['Normal', 'Prehypertension', 'Hypertension Stage 1', 'Hypertension Stage 2', 'Hypertensive Crisis'],
  //   required: function() {
  //     return this.type === 'Blood Pressure';
  //   },
  // },
  detectionSite: {
    type: String,
    enum: ['Arteri radialis', 'Arteri brakialis', 'Arteri karotis', 'Arteri poplitea', 'Arteri dorsalis pedis'],
    required: function() {
      return this.type === 'Pulse';
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

ttvSchema.pre('save', function (next) {
  switch (this.type) {
    case 'Blood Pressure':
      this.unit = 'mmHg';
      break;
    case 'Pulse':
      this.unit = 'bpm';
      break;
    case 'Respiration Rate':
      this.unit = 'breaths per minute';
      break;
    case 'Body Temperature':
      this.unit = '°C';
      break;
    default:
      this.unit = '';
  }
  next();
});

const ttv = mongoose.model('ttv', ttvSchema);
export default ttv;
