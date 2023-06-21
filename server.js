const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Initialize Passport

const DoctorModel = require('./models/DoctorModel')
const PatientModel=require('./models/PatientModel')
const AppointmentModel = require("./models/ApointmentModel");
const UserModel=require("./models/UserModel")
const MedicalRecordModel=require("./models/MedicalRecordModel")
const Prescription=require("./models/PrescriptionModel")
const Invoice=require("./models/InvoiceModel")

//access
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    next();
});

//middleware
app.use(express.json())
app.use(passport.initialize());

//routes
app.get('/', (req, res) => {
    res.send('hello node API')
})
//find all data(fetch)
app.get('/Doctors',async (req,res)=>{
    try {
        const Doctors=await DoctorModel.find({});
        res.status(200).json(Doctors);
    }catch (error){
        res.status(500).json({ message: error.message })
    }
})

//find data by id
app.get('/Doctors/:id',async (req,res)=>{
    try{
        const {id} =req.params;
        const Doctors=await DoctorModel.findById(id);
        res.status(200).json(Doctors);

    }catch (error){
        res.status(500).json({ message: error.message })
    }
})
//
app.post('/Doctors', async (req, res) => {
    try {
        const informationDoctor = await DoctorModel.create(req.body)
        res.status(200).json(informationDoctor)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
})
//update data
app.put('/Doctors/:id',async (req,res)=>{
    try{
        const {id} =req.params;
        const Doctors=await DoctorModel.findByIdAndUpdate(id,req.body);
        if (!Doctors){
            res.status(404).json({ message: `we can not find any doctor by this id ${id}` })
        }
        const updateDoctors =await DoctorModel.findById(id)
        res.status(200).json(updateDoctors);


    }catch (error){
        res.status(500).json({ message: error.message })
    }
})
//delete doctor data
app.delete('/Doctors/:id',async (req,res)=>{
    try
    {
        const {id}=req.params;
        const Doctors=await DoctorModel.findByIdAndDelete(id);
        if (!Doctors){
            res.status(404).json({ message: `we can not find any doctor by this id ${id}` })
        }
        res.status(200).json(Doctors);
    }catch (error){
        res.status(500).json({ message: error.message })
    }

})

// Get doctor's schedule by ID
app.get('/doctors/:id/schedule', async (req, res) => {
    try {
        const { _id } = req.params;
        const doctor = await DoctorModel.findById(_id);
np
        if (!doctor) {
            return res.status(404).json({ message: `Doctor with ID ${_id} not found` });
        }

        const schedule = doctor.schedule;
        const formattedSchedule = schedule.map(slot => ({
            day: slot.day.toISOString().split('T')[0],
            start: slot.start,
            end: slot.end
        }));
        res.status(200).json(formattedSchedule);
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
// Create a new route for doctors to set their availability
app.post('/availability', async (req, res) => {
    try {
        const { doctorId, schedule } = req.body;

        // Find the doctor in the database
        const doctor = await DoctorModel.findById(doctorId);

        // Check if the doctor exists
        if (!doctor) {
            return res.status(404).json({ message: `Doctor with ID ${doctorId} not found` });
        }

        // Set the doctor's availability
        doctor.setAvailability(schedule);

        // Save the updated doctor to the database
        const savedDoctor = await doctor.save();

        res.status(200).json(savedDoctor);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

//create a new appointment
app.post('/appointments', async (req, res) => {
    try {
        const { doctorId, patientId, date, time, duration } = req.body;

        // Find the doctor and patient in the database
        const doctor = await DoctorModel.findById(doctorId).populate('schedule');
        const patient = await PatientModel.findById(patientId);

        // Check if the doctor and patient exist
        if (!doctor) {
            return res.status(404).json({ message: `Doctor with ID ${doctorId} not found` });
        }
        if (!patient) {
            return res.status(404).json({ message: `Patient with ID ${patientId} not found` });
        }

        // Check if the requested appointment slot is available
        const slotAvailable = doctor.isSlotAvailable(date, time);

        if (!slotAvailable) {
            return res.status(400).json({ message: 'The requested appointment slot is not available' });
        }

        // Create a new appointment using the AppointmentModel
        const newAppointment = new AppointmentModel({
            doctor: doctor._id,
            patient: patient._id,
            date: date,
            time: time,
            duration: duration
        });

        // Save the new appointment to the database
        const savedAppointment = await newAppointment.save();

        // Add the appointment to the patient's appointments
        patient.appointments.push(savedAppointment);
        await patient.save();

        res.status(201).json(savedAppointment);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
});

//register a new user
app.post("/register", async (req, res) => {
    try {
        // Validate the request body
        if (!req.body.name || !req.body.email || !req.body.password) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
// Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new user
        const newUser = new UserModel({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            tel: req.body.tel,
            gender: req.body.gender,
            role: req.body.role,
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        res.status(200).json(savedUser);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ message: error.message });
    }
});
//passport
passport.use(
    new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
            try {
                // Find the user based on the email
                const user = await UserModel.findOne({ email });

                // If the user is not found or the password doesn't match, return an error
                if (!user || !(await bcrypt.compare(password, user.password))) {
                    return done(null, false, { message: 'Invalid credentials' });
                }

                // Login successful, pass the user object to the next middleware
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    )
);
//login
app.post(
    '/login',
    passport.authenticate('local', { session: false }),
    (req, res) => {
        // The user object is available in req.user
        res.status(200).json(req.user);
    }
);
//DOSSIER médicale
app.post('/medical-records', async (req, res) => {
    try {
        // Validate the request body
        if (!req.body.name || !req.body.gender || !req.body.dateOfBirth || !req.body.address ||
            !req.body.healthInsuranceNumber || !req.body.allergyRisk ||
            !req.body.medicalObservations || !req.body.diagnosis) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new medical record
        const newMedicalRecord = new MedicalRecordModel({
            name: req.body.name,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            address: req.body.address,
            healthInsuranceNumber: req.body.healthInsuranceNumber,
            allergyRisk: req.body.allergyRisk,
            medicalObservations: req.body.medicalObservations,
            diagnosis: req.body.diagnosis,
            additionalInformation: req.body.additionalInformation
        });

        // Save the medical record to the database
        const savedMedicalRecord = await newMedicalRecord.save();

        res.status(200).json(savedMedicalRecord);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the medical record' });
    }
});
//Prescription
app.post('/prescriptions', async (req, res) => {
    try {
        // Validate the request body
        if (!req.body.doctor || !req.body.patient || !req.body.medication || !req.body.dosage) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new prescription
        const newPrescription = new Prescription({
            doctor: req.body.doctor,
            patient: req.body.patient,
            medication: req.body.medication,
            dosage: req.body.dosage
        });

        // Save the prescription to the database
        const savedPrescription = await newPrescription.save();

        res.status(200).json(savedPrescription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the prescription' });
    }
});
// FACTURE
app.post('/invoices', async (req, res) => {
    try {
        // Validate the request body
        if (!req.body.invoiceNumber || !req.body.customerName || !req.body.amount) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create a new invoice
        const newInvoice = new Invoice({
            invoiceNumber: req.body.invoiceNumber,
            customerName: req.body.customerName,
            amount: req.body.amount
        });

        // Save the invoice to the database
        const savedInvoice = await newInvoice.save();

        res.status(200).json(savedInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while creating the invoice' });
    }
});


//connexion to mongodb
mongoose.connect('mongodb://127.0.0.1:27017/Patient', { useNewUrlParser: true })
    .then(() => {
        console.log('connected to mongodb')
        app.listen(4000, () => {
            console.log(`node is running in port 4000`)
        })
    })
    .catch((error) => {
        console.log(error)
    })