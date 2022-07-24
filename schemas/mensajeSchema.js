const mongoose = require('mongoose');



const mensajeSchema = new mongoose.Schema({
    author:{
        email:{type:String,require:true},
        name:{type:String,require:true,max:100},
        apellido:{type:String,require:true,max:100},
        edad:{type:Number,require:true, min:0},
        alias:{type:String,require:true,max:100},
        avatar:{type:String,require:true},
    },
    text:{type:String,require:true},
    timestamp:{type:Date}

})
module.exports= mensajeSchema;