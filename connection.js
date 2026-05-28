const mongoose = require('mongoose')

const connectToMongo = (url) => {
    mongoose.connect(url)
        .then(() => console.log("Database Connected"))
        .catch((err) => console.log("Connection Error: ", err))
}

module.exports = connectToMongo