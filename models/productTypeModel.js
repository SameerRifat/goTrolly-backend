const mongoose = require("mongoose");

const productTypeSchema = new mongoose.Schema({
    productType: {
        type: String,
        required: [true, "Please enter product type name"],
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category'
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
})

module.exports = mongoose.model("productType", productTypeSchema);