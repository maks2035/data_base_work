const { Pool } = require('pg');
var http = require("http");
var fs = require("fs");

// Подключение к базе данных PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mydatabase',
    password: 'admin',
    port: '5432',
});

http.createServer(function (request, response) {
    var str = request.url.split('=');
    switch(str[0]) { 
        case "/":
            var fileStream = fs.createReadStream("./index.html", "UTF-8");
            response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
            fileStream.pipe(response);
            break;
        case "/?fname":
            switch(str[1]){
                case "":
                    pool.query("SELECT * FROM Spaceships;", function(err, Result) { 
                        //console.log(Result.rows)
                        if(err) {
                            spaceship = {
                                id: 'no',
                                name: 'no',
                                type: 'no',
                                year_of_production:'no'
                            }
                            response.write(JSON.stringify(spaceship));
                        } else {
                            rows = Result.rows
                            response.write(JSON.stringify(rows));
                        }
                        response.end(); 
                    });
                    break;
                default:
                    arr = []
                    var temp = str[1]
                    temp = temp.replace(/%20/, " ")
                    //const query = `SELECT * FROM Spaceships WHERE Name LIKE '%${temp}%' OR  Type LIKE '%${temp}%'`
                    //pool.query(query, function(err, Result) {
                    
                    const query = {
                        text: 'SELECT * FROM Spaceships WHERE Name LIKE $1 OR  Type LIKE $1',
                        values: [`%${temp}%`],
                    };
                    pool.query(query, function(err, Result) {

                        //console.log(Result.rows)
                        if(err) {
                            spaceship = {
                                id: 'no',
                                name: 'no',
                                type: 'no',
                                year_of_production:'no'
                            }
                            response.write(JSON.stringify(spaceship));
                        } else {
                            rows = Result.rows
                            response.write(JSON.stringify(rows));
                        }
                        response.end(); 
                    });
                    
                    break;
            }
            break;

        default:
            response.writeHead(404, {"Content-Type": "text/html; charset=utf-8"}); 
            response.write("<!DOCTYPE html>\n" +
                "<html>\n" +
                " <head>\n" +
                " <meta charset='utf-8'>\n" + 
                " </head>\n" +
                " <body>\n"
                );
            
            response.write("404, NOT FOUND: " + request.url); 
            response.end(" </body>\n" +
                    "</html>\n");
        }
}).listen(3000);
console.log('Server is running on port 3000');