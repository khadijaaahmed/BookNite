const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = 'mongodb://127.0.0.1:27017/Wonderlust';
const methodOverride = require("method-override");
let path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");

// this must be placed after sessoin and flash 
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");

// --- MIDDLEWARE & CONFIG ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine('ejs', ejsMate);

app.use(session({
    secret: 'wonderlust3238',  // secret key
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false } // use false for local HTTP development
}));

app.use(flash());




// --- DATABASE CONNECTION ---
main().then(() => { console.log("connected to DB"); }).catch(err => console.log(err));
async function main() { await mongoose.connect(MONGO_URL) };



// root route
app.get("/", (req, res) => {
    res.send("Root");
});

//middleware for reslocal flash
app.use((req,res,next)=>{
    // we will call only key of flash mesg from re.locals
   res.locals.success=req.flash("success");
    next();
});

// listings
app.use("/listings",listings);

// reviews
app.use("/listings/:id/reviews",reviews);

// express error
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
});

// --- SERVER ---
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});