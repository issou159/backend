
const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoiceNumber: {
        type: String,
        required: true
    },
    customerName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const InvoiceModel = mongoose.model('Invoice', invoiceSchema);

module.exports = InvoiceModel;