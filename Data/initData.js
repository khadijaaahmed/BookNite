const mongoose =require("mongoose");
const Listing = require("../Models/listing");
const sampleListings = require("./data");

const MONGO_URL = 'mongodb://127.0.0.1:27017/Wonderlust';
main()
      .then(()=>{
    console.log("connected to DB");
}).catch(err => console.log(err));

async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB =async ()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(sampleListings.data);
    console.log("data initialized successfully")
};
initDB();