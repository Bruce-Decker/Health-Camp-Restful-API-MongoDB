var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');



var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var dataURL;

mongoose.connect('mongodb://localhost/HealthCamp');
var db = mongoose.connection;


var demo_schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    gender: String,
    age: Number,
    photo: String,
    notes: String
});
var demo_data = mongoose.model("demoData", demo_schema);
            


var health_schema = new mongoose.Schema({
   height: Number,
   weight: Number,
   temperature: Number,
   pulse: Number,
   bloodPressure: Number
});
var health_data = mongoose.model('healthData', health_schema);

var curr_dir = process.cwd()
app.use(express.static("./"));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));



app.get('/', function(req, res) {
     res.sendFile(curr_dir +'/Demographics.html');
});

app.get('/HealthVitals', function(req, res) {
     res.sendFile(curr_dir +'/Health Vitals.html');
});

app.get('/Reports', function(req, res) {
     res.sendFile(curr_dir +'/Reports.html');
});

app.get('/demoData', function(req, res) {
     res.sendFile(curr_dir +'/Demographics.html');
});

app.post('/demoData', function(req, res){
          var first_name = req.body.first_name;
          var last_name = req.body.last_name;
          var gender = req.body.gender;
          var age = req.body.age;
          var notes = req.body.notes;
          var dataURL = req.body.photo;
          var newDemoData = {first_name: first_name, last_name: last_name, gender: gender, age: age, photo: dataURL, notes: notes};
          demo_data.create(newDemoData, function(err, newlyCreated){
             if (err) {
              console.log("Error");
             } else {
              res.redirect("/");
             }
          });
});

app.post('/healthData', function(req, res) {
    
     var height = req.body.height;
     var weight = req.body.weight;
     var temperature = req.body.temperature;
     var pulse = req.body.pulse;
     var bloodPressure = req.body.bloodPressure;
     console.log(height + " " + weight + temperature + " " + pulse + " " + bloodPressure)
     var newHealthData = {height:height, weight: weight, temperature: temperature, pulse: pulse, bloodPressure: bloodPressure};
     health_data.create(newHealthData, function(err, newlyCreated){
             if (err) {
              console.log("Error Health Data");
             } else {
              res.redirect("/HealthVitals");
             }
          });
});

app.get('/database', function(req, res){
   demo_data.find({}, function(err, docs) {
        res.send(docs);
   });
});

app.get('/database2', function(req, res){
   health_data.find({}, function(err, info) {
        res.send(info);
   });
});


app.listen(3000);
console.log("Running app at port 3000");


function video() {

	
	var video = document.getElementById('video'),
	    canvas = document.getElementById('canvas'),
	   
	    context = canvas.getContext('2d'),
	    vendorUrl = window.URL || window.webkitURL;
	navigator.getMedia = navigator.getUserMedia ||
	                     navigator.webkitGetUserMedia ||
	                     navigator.mozGetUserMedia ||
	                     navigator.msGetUserMedia;

	navigator.getMedia ({
		video: true,
		audio: false
	}, function(stream) {
         video.src = vendorUrl.createObjectURL(stream);
         video.play();
	}, function(error) {

	});

	$('#form_button').on('click', function() { 

          context.drawImage(video, 0, 0, 400, 300);
            dataURL = canvas.toDataURL();
          
          var first_name = document.getElementById('FirstName').value;
          var last_name = document.getElementById('LastName').value;
          var gender = document.getElementById('Gender').value;
          var age = document.getElementById('Age').value;
          var notes = document.getElementById('Notes').value;
          var photo = dataURL;
          var info = {first_name: first_name, last_name: last_name, gender: gender, age: age, photo: photo, notes: notes};
          $.ajax({
            type: 'POST',
            url: '/demoData',
            data: info
          });


          
});

}



function report() {
 var $s = $('#result');
  

  
        $.ajax({
           type: 'GET',
           url: '/database',
           success: function(datas) {
            var space_s = '&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp';
            var space = '&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
             $.each(datas, function(i, data){
              
                   $s.append('<tbody> <tr>');
                   $s.append('<td>' + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + i + space  +'</td>');
                   $s.append('  <td>  ' + space_s + data.first_name + space + space + space + space + space + space_s +  '  </td>  ');
                   $s.append('  <td>  ' + data.last_name + space + space + space + space + space + space + '  </td>  ');
                   $s.append('  <td>  ' + data.gender + space + space + space + space + space +   '  </td>  ');
                   $s.append('  <td>  ' + data.age +  space  + '  </td>  ');
                   $s.append('  <td> <img src="' + data.photo +  '  " alt="W3Schools.com" height="200" width="200"> </td>  ');
                   $s.append('  <td> '  + space+ data.notes + ' </td>  ');
                   $s.append('  <td>' + ' </td> ')
                  
             });
           },
          error: function() {
              alert('no')
          },
          async: false
         
        });
        $s.append('</tbody></table>');

}



