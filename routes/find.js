const app=require("../app")
const DoctorModel = require("../models/DoctorModel");
app.get('/Doctors',async (req,res)=>{
    try {
        const Doctors=await DoctorModel.find({});
        res.status(200).json(Doctors);
    }catch (error){
        res.status(500).json({ message: error.message })
    }
})
app.get('/Doctors/:id',async (req,res)=>{
    try{
        const {id} =req.params;
        const Doctors=await DoctorModel.findById(id);
        res.status(200).json(Doctors);

    }catch (error){
        res.status(500).json({ message: error.message })
    }
})