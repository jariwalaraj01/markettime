const mongoose = require("mongoose")

// mongoDB connection function
mongoose.connect(process.env.DATABASE)
    .then((res) => {
        console.log("MongoDB connected");
    })
    .catch(err => {
        console.log(err);
    })