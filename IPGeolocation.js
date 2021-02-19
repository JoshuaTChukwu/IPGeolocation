const { Int32 } = require('bson');
const mongoose = require('mongoose');
//const { async } = require('q');


mongoose.connect('mongodb+srv://Joshua:HtXT8uAijusaA68@cluster0.iemkw.mongodb.net/MY_IP?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true });
const courseSchema = new mongoose.Schema({
    Range1: Number,
    Range2: Number,
    CountryCode: String,
    Country: String
})
const IPAddress = mongoose.model('IPLocation', courseSchema,'IPLocation');
async function Locate(IP){
    var number =  GetLocation(IP)
    const genres ={
        "_id": "602f9212dc38fe384856bf9c",
        "Range1": 2845786112,
        "Range2": 2845802495,
        "CountryCode": "NG",
        "Country": "Nigeria"
    };
    const IPaddress = await IPAddress.findOne().where('Range1').lte(number).and([{ Range2: { $gte: number}}]);
    if(!IPaddress){
        return genres;
    }
    else{
    return IPaddress;
}
    //console.log(IPaddress);
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