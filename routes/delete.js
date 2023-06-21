const DoctorModel = require("../models/DoctorModel");
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