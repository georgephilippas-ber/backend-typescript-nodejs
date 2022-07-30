import {Server} from "./source/server/server";
import {Resolvers} from "./source/server/resolvers";
import {agentsResolver} from "./source/sections/agents/resolvers/resolvers";

(() =>
{
    const resolvers = new Resolvers([agentsResolver()]);

    Server.createAndStart(resolvers);
})();
