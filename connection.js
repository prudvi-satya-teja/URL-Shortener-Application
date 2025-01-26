const mongoose = require("mongoose");

async function connectToDB(url) {
    return mongoose.connect(url);
}

module.exports =  { 
    connectToDB,
};
