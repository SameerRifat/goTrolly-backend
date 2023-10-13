const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    category: {
        type: String,
        required: [true, "Please enter category name"],
    },
    categoryImage: {
        type: String,
        default: ""
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
})

module.exports = mongoose.model("category", categorySchema);