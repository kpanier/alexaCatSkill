import express = require('express');
import { ResponseBody, OutputSpeech } from 'alexa-sdk';
import { Response, Session } from 'alexa-sdk';
import { SIHandler } from './SIHandler';

export class API {

    private server = express();
    userContacts: Map<string, number> = new Map();

    startServer(): any {
        this.configureServer()
        this.server.get('/', this.createHelloMessageEndpoint());
        this.server.post('/alexa', this.createAlexaEndpoint());
        this.server.post('/si', new SIHandler().createAlexaEndpoint());
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
            this.storeUser(alexaReq.session);
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

    storeUser(session: Session) {
        if (this.userContacts.get(session.user.userId)) {
            this.userContacts.set(session.user.userId, this.userContacts.get(session.user.userId) + 1);
        }
        else {
            this.userContacts.set(session.user.userId, 1);
        }
        console.log('Users: ' + this.userContacts.size);
        console.log('User: ' + session.user.userId + ' visits: ' + this.userContacts.get(session.user.userId));
    }

    dispatchIntent(intent: any): ResponseBody {
        switch (intent.name) {
            case 'futter':
                return this.getMjamMjam();
            case 'kuschel':
                return this.getSchnurr();
            case 'bauchen':
                return this.getKralleKrawallo();
            case 'bedarf':
                return this.getBedarfReaction(intent.slots);
            case 'AMAZON.StopIntent':
                return this.getStop();
            default:
                return this.getUnknown();
        }
    }

    getBedarfReaction(slots) {
        if (slots.art.value.toLowerCase() === 'steak')
            return this.getReponseBody('Br Mjam Br Mjam');
        else
            return this.getReponseBody('Was soll ich der kater mit ' + slots.art.value + '. Ich will steak, sonst gibts krawallo');
    }

    getStop(): ResponseBody {
        let speech: OutputSpeech = { text: 'Zeit zu schlafen. Bis zum nächsten mal.', type: "PlainText" };
        let res: Response = { outputSpeech: speech, shouldEndSession: true };
        return {
            version: "1.0",
            response: res
        }
    }

    getKralleKrawallo(): ResponseBody {
        return this.getReponseBody('Meine Vorder pfoten packen dich. Meine Zähne knappern an dir und meine Hinterpfoten boxen dich. Kralle krawallo oder das Kängeruh.');
    }

    getUnknown(): ResponseBody {
        return this.getReponseBody('Miau. Das verstehe ich nicht.');
    }

    getSchnurr(): ResponseBody {
        return this.getReponseBody('Miau. Schnurr Pühh Schnurr Pühh Schnurr. Das mag ich');
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