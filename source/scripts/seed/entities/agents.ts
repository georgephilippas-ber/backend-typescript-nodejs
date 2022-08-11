import {DataProvider} from "../../../model/data-provider";
import {AgentManager} from "../../../sections/identification/agents/managers/agent-manager";
import {faker} from "@faker-js/faker";
import {dtoCreateAgent} from "../../../sections/identification/agents/data-transfer-object/data-transfer-object";

import {Configuration} from "../../../configuration/configuration";

export async function seed(cardinality: number)
{
    const agentsManager = new AgentManager(new DataProvider(), new Configuration());

    for (let i_ = 0; i_ < cardinality; i_++)
    {
        const forename = faker.name.firstName(), surname = faker.name.lastName();

        let agentCreate: dtoCreateAgent = {credentials: [faker.internet.userName(forename, surname).toLowerCase(), faker.internet.email(forename, surname).toLowerCase(), faker.internet.password(0x10, true).toLowerCase(), faker.lorem.words(0x04)]};

        console.log(agentCreate);

        await agentsManager.create(agentCreate);
    }
}
