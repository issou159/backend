const DoctorModel = require("../models/DoctorModel");
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