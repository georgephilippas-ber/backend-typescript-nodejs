import express, {Express} from "express";
import {ApolloServer, ExpressContext} from "apollo-server-express";
import {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
import http, {Server as httpServer} from 'http';
import {GraphQLSchema} from "../interface/graphql-schema";
import {Controllers} from "../interface/controller";

export class Server
{
    expressApplication: Express;

    httpServer: httpServer;
    apolloServer: ApolloServer;

    constructor(graphQLSchema: GraphQLSchema, controllers: Controllers)
    {
        this.expressApplication = express();

        this.httpServer = http.createServer(this.expressApplication);

        this.apolloServer = new ApolloServer<ExpressContext>({
            typeDefs: graphQLSchema.getMergedTypeDefs(),
            resolvers: graphQLSchema.getMergedResolvers(),
            csrfPrevention: true,
            cache: "bounded",
            plugins: [ApolloServerPluginDrainHttpServer({httpServer: this.httpServer}), ApolloServerPluginLandingPageLocalDefault({embed: true})]
        });

        controllers.register(this.expressApplication);
    }

    async start(port: number = 0x1000): Promise<ApolloServer>
    {
        await this.apolloServer.start();

        this.apolloServer.applyMiddleware({
            app: this.expressApplication,
        });

        process.on("SIGINT", async args =>
        {
            console.log("!apolloServer");

            await this.apolloServer.stop();
        })

        return new Promise<ApolloServer>(resolve =>
        {
            this.httpServer.listen({port}, () => resolve(this.apolloServer))
        });
    }

    static createAndStart(graphQLSchema: GraphQLSchema, controllers: Controllers, port: number = 0x1000): Server
    {
        let apolloServer = new Server(graphQLSchema, controllers);

        apolloServer.start(port).then(value => console.log(["http://localhost", ":", port, value.graphqlPath].join("")));

        return apolloServer;
    }
}
