import {bServer} from "./server/server";
import {DataProvider} from "./model/data-provider";
import {AgentManager} from "./sections/authentication/managers/agent-manager";
import {AgentSchema} from "./sections/authentication/graphql-schema/agent-schema";
import {GraphQLSchema} from "./interface/graphql-schema";
import {AuthenticationController} from "./sections/authentication/controllers/authentication-controller";
import {Controllers} from "./interface/controller";
import {Configuration} from "./configuration/configuration";
import {SessionManager} from "./sections/authentication/managers/session-manager";
import {JSONWebToken} from "./model/json-web-token/json-web-token";
import {ProfileManager} from "./sections/profile/managers/profile-manager";
import {ProfileController} from "./sections/profile/controllers/profile-controller";

export async function bootstrap(): Promise<bServer>
{
    const configuration: Configuration = new Configuration();

    const dataProvider: DataProvider = new DataProvider();
    const agentManager: AgentManager = new AgentManager(dataProvider, configuration);

    const sessionManager: SessionManager = new SessionManager(agentManager, dataProvider);
    await sessionManager.delete_all();

    const profileManager: ProfileManager = new ProfileManager(dataProvider);

    const agentSchema: AgentSchema = new AgentSchema(agentManager);

    const graphQLSchema = new GraphQLSchema([agentSchema]);

    const jsonWebToken: JSONWebToken = new JSONWebToken(configuration.getSecretOrPrivateKey());

    const authenticationController = new AuthenticationController("/authentication", agentManager, sessionManager, jsonWebToken, configuration);
    const profileController = new ProfileController("/profile", profileManager);

    const controllers: Controllers = new Controllers([authenticationController, profileController]);

    return bServer.createAndStart(graphQLSchema, controllers, 0x1000);
}
