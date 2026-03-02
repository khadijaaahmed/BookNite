const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const Review = require("../Models/review");
const Listing = require("../Models/listing");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");


// this is for server site viladation of review  
const validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}

// review route in post 
router.post("/",validateReview, asyncWrap(async (req, res) => {
    let listing = await Listing.findById(req.params.id);//id listing ki find kary gi 
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}));

// delete review route in post
router.delete("/:reviewId" ,asyncWrap(async(req,res)=>{
     let { id, reviewId }= req.params;
    await Listing.findByIdAndUpdate(id , { $pull: {reviews: reviewId}}); // condition to delete
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;