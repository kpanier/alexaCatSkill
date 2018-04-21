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
            let alexaReq = request.body;
            console.log(alexaReq);
            let reqType = alexaReq.request.type;
            console.log(reqType)
            let result = {};
            switch (reqType) {
                case 'LaunchRequest':
                    response.status(200);
                    result = this.getHelloResponse();
                    break;
                case 'IntentRequest':
                    response.status(200);
                    result = this.dispatchIntent(alexaReq.request.intent);
                    break;
                default:
                    response.status(200);
            }
            response.send(result);
        }
    }

    dispatchIntent(intent: string): ResponseBody {
        switch (intent) {
            case 'futter':
                return this.getMjamMjam();
            case 'kuschel':
                return this.getSchnurr();
            case 'bauchen':
                return this.getKralleKrawallo();
            default:
                return this.getUnknown();
        }
    }

    getKralleKrawallo(): ResponseBody {
        return this.getReponseBody('Meine Vorder pfoten packen dich. Meine Zähne knappern an dir und meine Hinterpfoten boxen dich. Kralle krawallo oder das Kängeruh.');
    }

    getUnknown(): ResponseBody {
        return this.getReponseBody('Miau. Das verstehe ich nicht.');
    }

    getSchnurr(): ResponseBody {
        return this.getReponseBody('Miau. Brrr Brrr Brrr. Das mag ich');
    }

    getHelloResponse(): ResponseBody {
        return this.getReponseBody('Hallo von Kater Lee');
    }

    getMjamMjam(): ResponseBody {
        return this.getReponseBody('Ich der Kater Lee danke Dir für das viele Futter. Meine Höcker frohlocken und wachsen weiter.');
    }

    getReponseBody(message: string): ResponseBody {
        let speech: OutputSpeech = { text: message, type: "PlainText" };
        let res: Response = { outputSpeech: speech, shouldEndSession: false };
        return {
            version: "1.0",
            response: res
        }
    }
}