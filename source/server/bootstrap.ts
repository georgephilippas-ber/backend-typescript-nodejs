import {bServer} from "./server";
import {DataProvider} from "../model/data-provider";
import {AgentsManager} from "../sections/agents/managers/agents-manager";
import {AgentsSchema} from "../sections/agents/schema/agents-schema";
import {GraphQLSchema} from "../interface/graphql-schema";
import {AuthenticationController} from "../sections/authentication/controllers/authentication-controller";
import {Controllers} from "../interface/controller";

export async function bootstrap(): Promise<bServer>
{
    const dataProvider: DataProvider = new DataProvider();
    const agentsManager: AgentsManager = new AgentsManager(dataProvider);

    const agentsSchema: AgentsSchema = new AgentsSchema(agentsManager);

    const graphQLSchema = new GraphQLSchema([agentsSchema]);

    const authenticationController = new AuthenticationController("/authentication", agentsManager);

    const controllers: Controllers = new Controllers([authenticationController]);

    return bServer.createAndStart(graphQLSchema, controllers);
}
