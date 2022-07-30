import {DataProvider} from "../../../model/data-provider";
import {AgentsManager} from "../../../sections/agents/managers/agents-manager";
import {faker} from "@faker-js/faker";
import {dtoCreateAgent} from "../../../sections/agents/data-transfer-object/data-transfer-object";

export async function seed(cardinality: number)
{
    const agentsManager = new AgentsManager(new DataProvider());

    agentsManager.dataProvider.fromPrisma().agent.deleteMany({});

    for (let i_ = 0; i_ < cardinality; i_++)
    {
        const forename = faker.name.firstName("female"), surname = faker.name.lastName("female");

        let agentCreate: dtoCreateAgent = {credentials: [faker.internet.userName(forename, surname).toLowerCase(), faker.internet.email(forename, surname).toLowerCase(), faker.internet.password(0x10, true).toLowerCase(), faker.lorem.words(0x04)]};

        console.log(agentCreate.credentials);

        await agentsManager.create(agentCreate);
    }
}
