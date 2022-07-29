import express, {Express} from "express";
import {ApolloServer, ExpressContext} from "apollo-server-express";
import {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
import http, {Server as httpServer} from 'http';

export class Server
{
    expressApplication: Express;

    httpServer: httpServer;
    apolloServer: ApolloServer;

    constructor()
    {
        this.expressApplication = express();

        this.httpServer = http.createServer(this.expressApplication);

        this.apolloServer = new ApolloServer<ExpressContext>({
            typeDefs: "type Query { hello: String }",
            resolvers: {},
            csrfPrevention: true,
            cache: "bounded",
            plugins: [ApolloServerPluginDrainHttpServer({httpServer: this.httpServer}), ApolloServerPluginLandingPageLocalDefault({embed: true})]
        });
    }

    async start(port: number = 0x1000): Promise<ApolloServer>
    {
        await this.apolloServer.start();

        this.apolloServer.applyMiddleware({
            app: this.expressApplication,
        });

        return new Promise<ApolloServer>(resolve =>
        {
            this.httpServer.listen({port}, () => resolve(this.apolloServer))
        });
    }

    static createAndStart(port: number = 0x1000): Server
    {
        let apolloServer = new Server();

        apolloServer.start(port).then(value => console.log(["http://localhost", ":", port, value.graphqlPath].join("")));

        return apolloServer;
    }
}
