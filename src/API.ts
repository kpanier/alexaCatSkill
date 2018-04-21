import express = require('express');
import { ResponseBody, OutputSpeech } from 'alexa-sdk';
import { Response } from 'alexa-sdk';

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
            let alexaReq = JSON.parse(request.body)
            console.log(alexaReq);
            let reqType = alexaReq.request.type;
            console.log(reqType)
            let result = {};
            switch (reqType) {
                case 'LaunchRequest':
                    response.status(200);
                    result = this.getHelloResponse();
                    break;
                default:
                    response.status(200);
            }
            response.send(result);
        }
    }

    getHelloResponse(): ResponseBody {
        let speech: OutputSpeech = {text: "Hallo von Kater Lee", type: "PlainText"};
        let res: Response = {outputSpeech: speech};
        return {
            version: "1.0",
            response: res
        }
    }

}