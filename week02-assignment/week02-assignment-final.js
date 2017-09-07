var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync('week01-assignment/m04.txt');

var $ = cheerio.load(content);

$('table table table tbody').find('tr').each(function(i, elem){
  var streetAddress = $(elem).find('td').eq(0).contents().filter(function(){ 
    return this.nodeType == 3;
  }).eq(2);
  // use .trim to remove leading and trailing blank spaces; use .split on comma, 'Rm', and hyphen to remove all of the text that comes after the street address
  console.log($(streetAddress).text().trim().split(',')[0].split('Rm')[0].split('-')[0]);
});