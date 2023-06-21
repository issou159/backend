const mongoose = require('mongoose');

// Define the MedicalRecord schema
const medicalRecordSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    healthInsuranceNumber: {
        type: String,
        required: true
    },
    allergyRisk: {
        type: String,
        required: true
    },
    medicalObservations: {
        type: String,
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    additionalInformation: {
        type: String
    }
});

// Create the MedicalRecord model
const MedicalRecordModel = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecordModel;
