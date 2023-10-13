const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "please enter product name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "please enter product description"]
    },
    price: {
        type: Number,
        required: [true, "please enter product price"],
        maxLength: [8, "price cannot exceed 8 characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    // images: [
    //     {
    //         imagePath: {
    //             type: String,
    //             default: ""
    //         }
    //     }
    // ],
    images: [
        {
            type: String, 
            default: "" 
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: [true, "please enter product category"],
    },
    productType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productType'
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brand',
    },
    stock: {
        type: Number,
        required: [true, "please enter product stock"],
        maxLength: [4, "stock cannot exceed 4 characters"],
        default: 1
    },
    colors: [
        {
            type: String,
            default: ""
        }
    ],
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            reviewedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    sold: {
        type: Number,
        default: 0
    },
    isDeleted: { 
        type: Boolean, 
        default: false 
    },
    hasDiscount: {
        type: Boolean,
        default: false, 
    },
    discountPercentage: {
        type: Number,
        default: 0, 
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model("product", productSchema);