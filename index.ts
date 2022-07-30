import {Server} from "./source/server/server";
import {GraphQLSchema} from "./source/server/graphql-schema";
import {agentsResolver, agentsTypeDefs} from "./source/sections/agents/schema/agents-schema";

(() =>
{
    const graphQLSchema = new GraphQLSchema([agentsResolver()], [agentsTypeDefs()]);

    Server.createAndStart(graphQLSchema);
})();
