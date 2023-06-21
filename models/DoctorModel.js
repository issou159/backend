const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'please enter a name of patient']
        },
        specialty: {
            type: String,
            required: [true, 'please enter a name of Doctor']
        },
        country: {
            type: String,
            required: [true, 'please enter name of country']
        },
        city: {
            type: String,
            required: [true, 'please enter name of city']
        },
        image: {
            type: String,
            required: false
        },
        schedule: [{
            day: Date,
            start: String,
            end: String
        }]
    },
    {
        timestamps: true
    }
);

doctorSchema.methods.setAvailability = function(schedule) {
    this.schedule = schedule;
};

doctorSchema.methods.isSlotAvailable = function(date, time) {
    const dateTime = new Date(date);
    const scheduleDateTime = new Date(date);

    for (const slot of this.schedule) {
        scheduleDateTime.setHours(slot.start.getHours());
        scheduleDateTime.setMinutes(slot.start.getMinutes());

        if (scheduleDateTime.toISOString() === dateTime.toISOString() && slot.start <= time && slot.end > time) {
            return true;
        }
    }

    return false;
};

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
