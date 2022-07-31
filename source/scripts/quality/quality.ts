import {DataProvider} from "../../model/data-provider";

import {AgentsManager} from "../../sections/agents/managers/agents-manager";
import {SessionsManager} from "../../sections/sessions/managers/sessions-manager";

import moment from "moment";
import {bootstrap} from "../../bootstrap";
import axios from "axios";

import {JSONWebToken} from "../../model/json-web-token/json-web-token";
import {Configuration} from "../../configuration/configuration";

async function sessionsManager()
{
    let dataProvider = new DataProvider();
    let configuration = new Configuration();

    let sessionsManager = new SessionsManager(new AgentsManager(dataProvider, configuration), dataProvider);

    await sessionsManager.create({
        agentId: 1,
        expiresAt: moment().add(1, "hour").toDate()
    }).then(value => console.log(value));
    await sessionsManager.extend({by: {unit: "hours", quantity: 2}, id: 5}).then(value => console.log(value));

    await sessionsManager.deleteAll(1);
}

async function authenticationController()
{
    bootstrap().then(value =>
        {
            console.log(value.httpServer.listening);

            axios.post("http://localhost:4096/authentication/login", {credentials: ["lurline_romaguera19", "nazepudukixuqiqa"]}).then(value1 =>
            {
                console.log(value1.data);
            }).catch(reason => console.log(reason.code)).finally(() =>
            {
                value.stop();
            });
        }
    );
}
