import {bServer} from "./server/server";
import {DataProvider} from "./model/data-provider";
import {AgentsManager} from "./sections/agents/managers/agents-manager";
import {AgentsSchema} from "./sections/agents/schema/agents-schema";
import {GraphQLSchema} from "./interface/graphql-schema";
import {AuthenticationController} from "./sections/authentication/controllers/authentication-controller";
import {Controllers} from "./interface/controller";
import {Configuration} from "./configuration/configuration";
import {SessionsManager} from "./sections/sessions/managers/sessions-manager";
import {JSONWebToken} from "./model/json-web-token/json-web-token";

export async function bootstrap(): Promise<bServer>
{
    const configuration: Configuration = new Configuration();

    const dataProvider: DataProvider = new DataProvider();
    const agentsManager: AgentsManager = new AgentsManager(dataProvider, configuration);
    const sessionsManager: SessionsManager = new SessionsManager(agentsManager, dataProvider);

    const agentsSchema: AgentsSchema = new AgentsSchema(agentsManager);

    const graphQLSchema = new GraphQLSchema([agentsSchema]);

    const jsonWebToken: JSONWebToken = new JSONWebToken(configuration.getSecretOrPrivateKey());

    const authenticationController = new AuthenticationController("/authentication", agentsManager, sessionsManager, jsonWebToken, configuration);

    const controllers: Controllers = new Controllers([authenticationController]);

    return bServer.createAndStart(graphQLSchema, controllers);
}