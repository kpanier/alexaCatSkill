import { ResponseBody, OutputSpeech, Response } from 'alexa-sdk';

export class SIHandler {

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
                default:
                    response.status(200);
            }
            response.send(result);
        }
    }

    getHelloResponse(): ResponseBody {
        return this.getReponseBody('Willkommen bei meine Signal Iduna.');
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