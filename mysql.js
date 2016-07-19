var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : '192.168.30.34',
  user     : 'root',
  password : 'root'
});

connection.connect();

exports.q1=function(){
var result=connection.query('SELECT now() AS solution', function(err, rows, fields) {
  if (err) throw err;
  console.log('The solution is: ', rows[0].solution);
});
console.log(result);
return result;
}
