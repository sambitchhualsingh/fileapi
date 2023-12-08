const mongoose = require('mongoose')

const fileSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim: true 
    },
    desc: {
        type: String,
        require: true,
        trim: true   
    },
    url: {
        type: String,
        require: true,
        trim: true 
    },
    public_id: {
        type: String,
        require: true,
        trim: true,
        unique: true 
    },
    user_id: {
        type: mongoose.Schema.ObjectId,
        require: true,
    },
    category:{
        type: String,
        require: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{
    collection: "files",
    timestamps: true 
})

module.exports = mongoose.model("File", fileSchema)