import {Server} from "./source/server/server";
import {GraphQLSchema} from "./source/interface/graphql-schema";
import {AgentsSchema} from "./source/sections/agents/schema/agents-schema";
import {AgentsManager} from "./source/sections/agents/managers/agents-manager";
import {DataProvider} from "./source/model/data-provider";
import {AuthenticationController} from "./source/sections/authentication/controllers/authentication-controller";
import {Controllers} from "./source/interface/controller";

(() =>
{
    const dataProvider: DataProvider = new DataProvider();
    const agentsManager: AgentsManager = new AgentsManager(dataProvider);

    const agentsSchema: AgentsSchema = new AgentsSchema(agentsManager);

    const graphQLSchema = new GraphQLSchema([agentsSchema]);

    const authenticationController = new AuthenticationController("authentication", agentsManager);

    const controllers: Controllers = new Controllers([authenticationController]);

    Server.createAndStart(graphQLSchema, controllers);
})();
