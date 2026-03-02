const express = require("express");
const router = express.Router();
const asyncWrap = require("../utils/asyncWrap.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../Models/listing");
const ExpressError = require("../utils/ExpressError.js");

// this is for server site viladation of listings update 
const validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
}

// / 1. INDEX ROUTE - Show all listings
router.get("/", asyncWrap(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("mainpage.ejs", { allListings });
}));

// 2. NEW ROUTE - Form to create new listing
router.get("/new", (req, res) => {
    res.render("newList.ejs");
});

// 3. CREATE ROUTE - Create new listing (handles the form submit from NEW)
router.post("/",
    validateListing,
    asyncWrap( async (req, res) => {
    const addNewList = new Listing(req.body.Listing);
    await addNewList.save();
    res.redirect("/listings");
}));

// 4. SHOW ROUTE - Show one specific listing
router.get("/:id", asyncWrap(async (req, res) => {
    let { id } = req.params;
    const singleList = await Listing.findById(id).populate("reviews")
    res.render("show.ejs", { singleList });
}));

// 6. UPDATE ROUTE - Update a listing (handles the form submit from EDIT)
router.put("/:id",
    validateListing,
    asyncWrap( async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.Listing });
    res.redirect("/listings");
}));

// 7. DELETE ROUTE
router.delete("/:id",asyncWrap(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

// 5. EDIT ROUTE - Form to edit a listing
router.get("/:id/edit",asyncWrap( async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findById(id);
    res.render("updateList.ejs", { List });
}));

module.exports= router;