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
    //console.log(IPaddress);
}
async function getAllCountry(){
     await IPAddress.aggregate([{$group:{
        Country:'$Country',
        Code:'$CountryCode'
    }}], function (err, result) {
        if(result){
            return result;
            console.log(result);
        }
        else{
            return [];
        }
    })
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

module.exports.Locate= Locate;
