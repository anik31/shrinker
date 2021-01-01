const mongoose = require("mongoose");
const shortUrlSchema = new mongoose.Schema({
    url : String,
    shortId:String
});

const ShortUrl = mongoose.model('shorturl', shortUrlSchema);

module.exports = ShortUrl;