const { Int32 } = require('bson');
const mongoose = require('mongoose');
require('dotenv').config();
const fs = require('fs');
const { convert } = require('html-to-text');
//const { async } = require('q');


mongoose.connect(process.env.MongoUrl,{useNewUrlParser: true, useUnifiedTopology: true });
const courseSchema = new mongoose.Schema({
    Range1: Number,
    Range2: Number,
    CountryCode: String,
    Country: String
    
});
var citySchema = new mongoose.Schema({
    city: String,
    city_ascii:String,
    lat:String,
    lng:String,
    country:String,
    iso2:String,
    iso3:String,
    admin_name:String,
    capital:String,
    population:String
})
const currencySchema = new mongoose.Schema({
    CountryCode: String,
    CurrencyCode: String,
    CurrencySymbol: String,
    Currency: String,
    IsHTMLSymbol:Boolean
 
});
const countrySchema = new mongoose.Schema({
    CountryCode: String,
    Country: String,
})
const IPAddress = mongoose.model('IPLocation', courseSchema,'IPLocation');
const Currency = mongoose.model('Currency ',currencySchema,'Currency');
const City = mongoose.model('Cities',citySchema,'Cities');
async function Locate(IP){
    var number =  GetLocation(IP)
    const genres ={
        
        "Range1": 2845786112,
        "Range2": 2845802495,
        "CountryCode": "NG",
        "Country": "Nigeria",
        "CurrencyCode":"NGN",
        "CurrencySymbol":"₦",
        "CurrencyName":"Nigerian naira"
    };

    const IPaddress = await IPAddress.findOne().where('Range1').lte(number).and([{ Range2: { $gte: number}}]);
    if(!IPaddress){
        return genres;
    }
    else{
        var currency = await Currency.findOne({CountryCode: IPaddress.CountryCode});
       if(!currency){
           return {
            Range1:IPaddress.Range1,
            Range2: IPaddress.Range2,
            CountryCode: IPaddress.CountryCode,
            Country: IPaddress.Country,
            CurrencyCode:"",
            CurrencySymbol:"",
            CurrencyName: ""

           }
       }
   else {
       if(currency.IsHTMLSymbol = true){
           var ans = convert(currency.CurrencySymbol,{
            wordwrap: 130
          });
         
        currency.CurrencySymbol =ans; 
       }
       return  {
        Range1:IPaddress.Range1,
        Range2: IPaddress.Range2,
        CountryCode: IPaddress.CountryCode,
        Country: IPaddress.Country,
        CurrencyCode:currency.CurrencyCode,
        CurrencySymbol:currency.CurrencySymbol,
        CurrencyName: currency.Currency

       }
   }
}
    
}
async function getOneCountry(code){
    var country = await IPAddress.findOne({CountryCode: code});
    if(country){
        const curr = await Currency.findOne({CountryCode:code});
        const response = {
            Country:country.Country,
      CountryCode:code,
      CurrencySymbol: getsymbol(curr),
      CurrencyCode:curr?.CurrencyCode??"",
      CurrencyName: curr?.Currency??"" 
        }
        return response
    }
    return {};
}
async function getAllCountry(){
   var item =  await IPAddress.aggregate([{ $group:{
        _id: "$Country",
        Code:{'$first':'$CountryCode'},
        
    }},
    {
        $lookup:{
            from:"Currency",
            localField:"Code",
            foreignField:"CountryCode",
            as:"test"
        }
    }], function (err, result) {
        if(result){
            return result;
            
        }
        else{
            return [];
        }
    })
    const res = item.map((a)=>  {
      return {
        Country:a._id,
      CountryCode:a.Code,
      CurrencySymbol: getsymbol(a.test[0]),
      CurrencyCode:a.test[0]?.CurrencyCode??"",
      CurrencyName: a.test[0]?.Currency??""
      }
    });
    
    return res;
}
function getsymbol(data){
    if(data){
        if(data.IsHTMLSymbol ==true){
            return convert(data.CurrencySymbol,{
                wordwrap: 130
              });
        }
       return data.CurrencySymbol; 
    }
return ""
}
async function getCityByCountry(code){
    var cities = await City.find({
        iso2:code
    });
    const fomatedCity = cities.map((city)=>{
        return {
            CityName:city.city,
            CountryName: city.country,
            CountryCode :code,
            Population : city.population
        }
    });
   
    return fomatedCity;
}

//Locate('197.210.64.210')
function GetLocation(IPaddresses){
    
    if (IPaddresses !=''){
    var SubAddress = IPaddresses.split('.');
    var i, fullBinary;
    var fullBinary= '';
    
     for (i = 0; i< SubAddress.length; i++){
      var binary = dec_to_bin(SubAddress[i]);
      if(binary.length < 8){
          let j = binary.length;
          for(;j< 8;j++){
           binary = '0'+binary;
          };
      }
      fullBinary =fullBinary + binary
     
     };
     var IPNumber = bin_to_dec(fullBinary);
     return +IPNumber;
    }
    else{
        return 5;
    }

}

function dec_to_bin(bstr) { 
    var num = +bstr;
    var n = num.toString(2);
   
   return n;
}
function bin_to_dec(str){
return parseInt(str,2)
}
const IPModule = {
    Locate,
    getAllCountry,
    getCityByCountry,
    getOneCountry
}

module.exports.IPModule= IPModule;
