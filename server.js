const express = require('express');
const shortid = require('shortid');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ShortUrl = require('./models/url-model');

require('dotenv').config()

const app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine','ejs');
app.use(express.static('public'));
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify: false,
    useUnifiedTopology:true
});

app.get('/', (req,res)=>{
    res.render('index');
})

app.get('/:shortId',(req,res)=>{
    const shortId = req.params.shortId;
    ShortUrl.findOne({shortId},(err,foundUrl)=>{
        res.redirect(foundUrl.url);
    })
})

app.post('/',(req,res)=>{
    const url = req.body.url;
    ShortUrl.exists({ url }).then(exists => {
        if (exists) {
            ShortUrl.findOne({url},(err,url)=>{
            res.render('index', {short_url: `${req.headers.host}/${url.shortId}`});
            });
        } else {
            const shortUrl = new ShortUrl({url:url,shortId:shortid.generate()});
            shortUrl.save().then(res.render('index',{short_url: `${req.headers.host}/${shortUrl.shortId}`}));                
        }
      })
})

app.listen(process.env.PORT || 3000);