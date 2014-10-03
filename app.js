var http = require("http"),
    url = require("url"),
    path = require("path"),
    fs = require("fs");
 
http.createServer(function(request, response) {
 
    var uri = 'www' + url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri),
        html_filename = filename + '.html';
  
    fs.exists(filename, function(exists) {
        if(!exists) {
            response.writeHead(404, {"Content-Type": "text/plain"});
            response.write("404 Not Found\n");
            response.end();
            return;
        }

        if (fs.statSync(filename).isDirectory()) filename += '/index.html';

        fs.readFile(filename, "binary", function(err, file) {
            if(err) {
                response.writeHead(500, {"Content-Type": "text/plain"});
                response.write(err + "\n");
                response.end();
                return;
            }

            if(path.extname(request.url) == ".gif"){
                response.writeHead(200, {'content-type':'image/gif'});
            }
            else if(path.extname(request.url) == ".svg"){
                response.writeHead(200, {'content-type':'image/svg+xml'});
            }
            else if(path.extname(request.url) == ".js"){
                response.writeHead(200, {'content-type':'application/javascript'});
            } 
            else if(path.extname(request.url) == ".css"){
                response.writeHead(200, {'content-type':'text/css'});
            } 
            else {
                response.writeHead(200);
            }
            
            response.write(file, "binary");
            response.end();
        });
    });
}).listen( 3000 );
 
console.log("Static file server running at\n  => http://localhost:3000/\nCTRL + C to shutdown");