import {Server} from "./source/server/server";
import {GraphQLSchema} from "./source/server/graphql-schema";
import {AgentsSchema} from "./source/sections/agents/schema/agents-schema";
import {AgentsManager} from "./source/sections/agents/managers/agents-manager";
import {DataProvider} from "./source/model/data-provider";

(() =>
{
    const dataProvider: DataProvider = new DataProvider();
    const agentsManager: AgentsManager = new AgentsManager(dataProvider);

    const agentsSchema: AgentsSchema = new AgentsSchema(agentsManager);

    const graphQLSchema = new GraphQLSchema([agentsSchema]);

    Server.createAndStart(graphQLSchema);
})();
