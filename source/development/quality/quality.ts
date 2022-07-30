import {DataProvider} from "../../model/data-provider";

import {AgentsManager} from "../../sections/agents/managers/agents-manager";
import {SessionsManager} from "../../sections/sessions/managers/sessions-manager";

import moment from "moment";

async function sessionsManager()
{
    let dataProvider = new DataProvider();

    let sessionsManager = new SessionsManager(new AgentsManager(dataProvider), dataProvider);

    // await sessionsManager.create({agentId: 1, expiresAt: moment().add(1, "hour").toDate()}).then(value => console.log(value));
    // await sessionsManager.create({agentId: 17, expiresAt: moment().add(1, "hour").toDate()}).then(value => console.log(value));
    //
    // await sessionsManager.create({agentId: 13}).then(value => console.log(value));
    // await sessionsManager.extend({by: {unit: "hours", quantity: 2}, id: 13}).then(value => console.log(value));

    await sessionsManager.extend({by: {unit: "hours", quantity: 2}, id: 5}).then(value => console.log(value));

    await sessionsManager.deleteAll(1);
}

sessionsManager().then(value => null);
