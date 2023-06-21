const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    doctor: {
        type: String,
        required: true
    },
    patient: {
        type: String,
        required: true
    },
    medication: {
        type: String,
        required: true
    },
    dosage: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;