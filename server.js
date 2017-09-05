// server.js
// where your node app starts

// init project
var express = require('express');
var bodyParser = require('body-parser');
var mongoose= require('mongoose');
var validUrl = require('valid-url');
var cors = require('cors');
var app = express();
mongoose.connect('mongodb://urldata:panamika9162@ds127034.mlab.com:27034/urlshortnerdata');
var userschema = mongoose.Schema({
  original:String,
  short:String
});
var Todo = mongoose.model('Todo',userschema);



// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(cors());
app.get('/',function(re,res){
  res.sendFile(__dirname + '/views/index.html');      
})
app.get('/:a',function(req,res){
  //console.log(req.params.a)
  //console.log()
  Todo.findOne({short:req.params.a}).exec(function(err,url){
    if(err){
      throw err
    }
    else{
      res.redirect(url.original)
    }
  })
    //console.log(Todo.short);
     //res.setHeader('Content-Type', 'application/json');)
  
})

// http://expressjs.com/en/starter/basic-routing.html
app.get('/new/:urltoshort(*)', function (request, response,next) {
  var originalUrl = request.params;
  if (validUrl.isUri(originalUrl.urltoshort)){
    var shortedUrl = Math.floor(Math.random()*1001).toString();
    var urltoshort = {"urltosort":originalUrl.urltoshort,"shortedurl":"https://dark-pheasant.glitch.me/"+shortedUrl};
    var urlItem =Todo({original:originalUrl.urltoshort,
                       short:shortedUrl}).save(function(err){
      if(err){
        throw err
      }
      else{
        console.log("data saved")
      }
    });
    response.setHeader('Content-Type', 'application/json');
    response.send(urltoshort)
    //console.log('Looks like an URI');
    
} 
else {
    console.log('Not a URI');
  response.json("It is not a valid url, Make sure to have real one")
}
  
})


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
