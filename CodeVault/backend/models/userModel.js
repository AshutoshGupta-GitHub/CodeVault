const mongoose = require("mongoose");
const {Schema} = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    password: {
        type: String,
      
    },
    repositories: [{
        default: [],
        type: Schema.Types.ObjectId,
        ref: 'Repository'
    }] , // Array to hold user's repositories
    
     followedUsers: [{
        default: [],
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
     startRepos: [{
        default: [],
        type: Schema.Types.ObjectId,
        ref: 'Repository'
    }]
});

const User = mongoose.model("User", UserSchema);

module.exports = User;