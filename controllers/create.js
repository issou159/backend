const DoctorModel = require("../models/DoctorModel");

async function createDoctor(req, res) {
    try {
        const informationDoctor = await DoctorModel.create(req.body)
        res.status(200).json(informationDoctor)
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ message: error.message })
    }
}

module.exports = { createDoctor };