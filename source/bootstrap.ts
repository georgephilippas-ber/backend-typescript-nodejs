import {bServer} from "./server/server";
import {DataProvider} from "./model/data-provider";
import {AgentManager} from "./sections/authentication/managers/agent-manager";
import {AgentSchema} from "./sections/authentication/graphql-schema/agent-schema";
import {GraphQLSchema} from "./interface/graphql-schema";
import {AuthenticationController} from "./sections/authentication/controllers/authentication-controller";
import {Controllers} from "./interface/controller";
import {Configuration} from "./configuration/configuration";
import {SessionsManager} from "./sections/authentication/managers/sessions-manager";
import {JSONWebToken} from "./model/json-web-token/json-web-token";

export async function bootstrap(): Promise<bServer>
{
    const configuration: Configuration = new Configuration();

    const dataProvider: DataProvider = new DataProvider();
    const agentsManager: AgentManager = new AgentManager(dataProvider, configuration);

    const sessionsManager: SessionsManager = new SessionsManager(agentsManager, dataProvider);
    await sessionsManager.delete_all();

    const agentSchema: AgentSchema = new AgentSchema(agentsManager);

    const graphQLSchema = new GraphQLSchema([agentSchema]);

    const jsonWebToken: JSONWebToken = new JSONWebToken(configuration.getSecretOrPrivateKey());

    const authenticationController = new AuthenticationController("/authentication", agentsManager, sessionsManager, jsonWebToken, configuration);

    const controllers: Controllers = new Controllers([authenticationController]);

    return bServer.createAndStart(graphQLSchema, controllers, 0x1000);
}
