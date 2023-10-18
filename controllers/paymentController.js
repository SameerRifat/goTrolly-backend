const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
// const stripe = require("stripe")("sk_test_51MneqjL9V15WUmnlOEjIVGyfRtTwhZCSKOWszPDQ5MrBfyYq4iKXneeUCW3MlF9Dk8lcFNn2tfxnptj8NxF1Q3fC00Ek0ONavP")

exports.processPayment = catchAsyncErrors(async (req, res, next)=>{
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
    const myPayment = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'usd',
        metadata: {
            company: "Ecommerce"
        },
    });
    res.status(200).json({
        success: true,
        client_secret: myPayment.client_secret
    })
})

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next)=>{
    res.status(200).json({stripeApiKey: process.env.STRIPE_API_KEY})
})