const fs = require("fs");
const req = require("request");

//this module lets us construct the filepath
const path = require("path");

const router = (request, response) => {
    //console.log("this is a massage");
    const url = request.url;
    console.log(url);
    if (url === "/") {
        // const html = fs.readFileSync(
        //   path.join(__dirname, "..", "public", "index.html")
        // );


        fs.readFile(
            path.join(__dirname, "..", "public", "index.html"),
            (error, file) => {
                if (error) {
                    console.log(error);
                    response.writeHead(500, { "Content-Type": "text/html" });
                    response.end(
                        "<h1>Sorry, we have had a problem with the server </h1>"
                    );
                } else {
                    response.writeHead(200, { "Content-Type": "text/html" });
                    response.end(file);
                }
            }
        );
    } else if (url === '/fetchNames') {

        var options = {
            method: 'GET',
            url: 'https://free-nba.p.rapidapi.com/players',
            qs: { page: '0', per_page: '25' },
            headers: {
                'x-rapidapi-host': 'free-nba.p.rapidapi.com',
                'x-rapidapi-key': 'd2f04481bfmsh7b77972de4ec2dfp1964bdjsn3338e26bee8f'
            }
        };

        req(options, function (error, res, body) {
            if (error) throw new Error(error);

            response.end(body);
        });
    }
    else if (url.indexOf("/public/") !== -1) {
        const extension = url.split(".")[1];
        const extensionType = {
            html: "text/html",
            css: "text/css",
            js: "application/javascript",
            ico: "image/x-icon"
        };
        const filePath = path.join(__dirname, "..", url);
        fs.readFile(filePath, (error, file) => {
            if (error) {
                response.writeHead(500, { "Content-Type": "text/html" });
                response.end("<h1>Sorry, we have had a problem with the server </h1>");
            } else {
                response.writeHead(200, { "Content-Type": extensionType[extension] });
                response.end(file);
            }
        });
    } else {
        response.writeHead(404);
        response.end("404 not found");
    }
};

module.exports = router;