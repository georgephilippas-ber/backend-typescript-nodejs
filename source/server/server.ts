import express, {Express} from "express";
import {ApolloServer, ExpressContext} from "apollo-server-express";
import {ApolloServerPluginDrainHttpServer, ApolloServerPluginLandingPageLocalDefault} from "apollo-server-core";
import http, {Server as httpServer} from 'http';
import {GraphQLSchema} from "../interface/graphql-schema";
import {Controllers} from "../interface/controller";

import cors from "cors";

export class bServer
{
    expressApplication: Express;

    httpServer: httpServer;
    apolloServer: ApolloServer;

    constructor(graphQLSchema: GraphQLSchema, controllers: Controllers)
    {
        this.expressApplication = express();
        this.expressApplication.use(cors());

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

    async start(port: number): Promise<bServer>
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

        return new Promise<bServer>(resolve =>
        {
            this.httpServer.listen({port}, () => resolve(this));
        });
    }

    async stop(): Promise<void>
    {
        return this.apolloServer.stop();
    }

    static async createAndStart(graphQLSchema: GraphQLSchema, controllers: Controllers, port: number = 0x1000): Promise<bServer>
    {
        let bServer_ = new bServer(graphQLSchema, controllers);

        return bServer_.start(port);
    }
}
