const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = 'mongodb://127.0.0.1:27017/Wonderlust';
const methodOverride = require("method-override");
let path = require("path");
const ejsMate = require("ejs-mate");
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

// --- DATABASE CONNECTION ---
main().then(() => { console.log("connected to DB"); }).catch(err => console.log(err));
async function main() { await mongoose.connect(MONGO_URL) };



// root route
app.get("/", (req, res) => {
    res.send("Root");
});
app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render("error.ejs",{message});
});

// --- SERVER ---
app.listen(8080, () => {
    console.log("server is listening to port 8080");
});