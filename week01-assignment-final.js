// Aaron,
// Just want to be transparent that I got assistance from Will with finishing up this code. I had the right idea -- to make a for loop
// from 1 to 10 in order to 1) call the URLs sequentially and 2) set the output filenames (although I was doing it with a variable 
// containing strings '01', '02', ... instead of with integers padded with a 0) -- but I needed his help with the syntax in the end.
// Julian

var request = require('request');
var fs = require('fs');

// initialize i and j
var i = 1;
var j;

function week01Assignment() {
    
  if (i < 10) {
      j = "0" + i;
  }
  else {
      j = "" + i;
  };

  var url = 'http://visualizedata.github.io/datastructures/data/m' + j + '.html';
  request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
          fs.writeFileSync('/home/ubuntu/workspace/week01-assignment/m' + j + '.txt', body);

          i++;

          if(i<=10){
            // call week01Assignment() again through to i=10
            week01Assignment();
          }
          if(i>10){
            return;
          }
      }
      else {console.error('request failed')}
  });
}

week01Assignment()
