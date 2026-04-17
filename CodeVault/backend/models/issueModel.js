const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const IssueSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {   
        type: String,
        enum: ["open", "in progress", "closed"],
        default: "open",
    },
    repository: {
        type: Schema.Types.ObjectId,
        ref: "Repository",  
        required: true
    },

});

const Issue = mongoose.model("Issue", IssueSchema);     
module.exports = Issue;