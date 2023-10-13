const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema({
    brandName: {
        type: String,
        required: [true, "Please enter category name"],
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

module.exports = mongoose.model("brand", brandSchema);