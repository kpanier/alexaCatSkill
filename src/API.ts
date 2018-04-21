import express = require('express');

export class API {

    private server = express();

    startServer(): any {
        this.configureServer()
        this.server.get('/', this.createHelloMessageEndpoint());
        this.server.post('/alexa', this.createAlexaEndpoint());
        this.launchHttpServer();
    }

    configureServer(): any {
        let bodyParser = require('body-parser');
        this.server.use(bodyParser.urlencoded({
            extended: false
        }));
        this.server.use(bodyParser.json());
    }

    private launchHttpServer(): any {
        let fs = require('fs');
        let https = require('https');
        let privateKey = fs.readFileSync(process.env.httpsprivatekey, 'utf8');
        let certificate = fs.readFileSync(process.env.httpscertificate, 'utf8');
        let credentials = { key: privateKey, cert: certificate };
        let httpsServer = https.createServer(credentials, this.server);
        httpsServer.listen(443);
    }
    
    createHelloMessageEndpoint(): any {
        return (request, response) => {
            response.send('Server is up and running.');
        };
    }

    createAlexaEndpoint(): any {
        return (request, response) => {
            console.log(request.body);
            response.status(200);
        }
    }

}