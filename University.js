const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MongoUrl,{useNewUrlParser: true, useUnifiedTopology: true });
const UniversitySchema = new mongoose.Schema(
    {
        _id:String,
        name:String,
        alpha_two_code:String,
        web_pages: Array,
        state_province:mongoose.Schema.Types.Mixed,
        country:String,
        domains:Array
    }
   
)
const University = mongoose.model("Universities",UniversitySchema,"Universities")

async function getAllUniversities(){
    const universities = await University.find();
    return universities;
}
async function getUniversitiesByCountry(countryCode){
    const universities = await University.find({alpha_two_code:countryCode}); 
    return   universities;
}
 const UniversityModule ={ 
    getAllUniversities,
    getUniversitiesByCountry
}
module.exports.UniversityModule= UniversityModule;
