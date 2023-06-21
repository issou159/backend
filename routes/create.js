const DoctorModel = require("../models/DoctorModel");
const AppointmentModel = require("../models/ApointmentModel");
const PatientModel = require('../models/PatientModel');
const app = require('../app');


app.post('/Doctors', async (req, res) => {
    try {
        const informationDoctor = await DoctorModel.create(req.body)
        res.status(200).json(informationDoctor)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})
//creer un rendez vous
app.post('/appointments', async (req, res) => {
    try {
        const { doctorId, patientId, date, time, duration } = req.body;

        // Create a new appointment using the AppointmentModel
        const newAppointment = new AppointmentModel({
            doctor: doctorId,
            patient: patientId,
            date: date,
            time: time,
            duration: duration
        });

        // Save the new appointment to the database
        const savedAppointment = await newAppointment.save();

        res.status(201).json(savedAppointment);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});
//creer un patient


app.post('/patients', async (req, res) => {
    try {
        const informationPatient = await PatientModel.create(req.body)
        res.status(200).json(informationPatient)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
});