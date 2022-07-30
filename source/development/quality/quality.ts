import {DataProvider} from "../../model/data-provider";

import {AgentsManager} from "../../sections/agents/managers/agents-manager";
import {SessionsManager} from "../../sections/sessions/managers/sessions-manager";

import moment from "moment";
import {bootstrap} from "../../server/bootstrap";
import axios from "axios";

async function sessionsManager()
{
    let dataProvider = new DataProvider();

    let sessionsManager = new SessionsManager(new AgentsManager(dataProvider), dataProvider);

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

            axios.post("http://localhost:4096/authentication/login", {credentials: ["tremaine_walsh75", "yataqijugezapubo"]}).then(value1 =>
            {
                console.log(value1.data);
            }).catch(reason => console.log(reason.code)).finally(() =>
            {
                value.stop();
            });
        }
    );
}

authenticationController();
