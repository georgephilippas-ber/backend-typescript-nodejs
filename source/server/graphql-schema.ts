import {mergeResolvers, mergeTypeDefs} from "@graphql-tools/merge";
import {gql} from "apollo-server-express";

export class GraphQLSchema
{
    resolvers: any[];
    typeDefs: any[];

    constructor(resolvers: any[], typeDefs: any[])
    {
        this.resolvers = resolvers;
        this.typeDefs = [typeDefs, gql`
            type Query
            {
                random: Float!
            }
        `];
    }

    public getMergedResolvers()
    {
        return mergeResolvers(this.resolvers);
    }

    public getMergedTypeDefs()
    {
        return mergeTypeDefs(this.typeDefs);
    }
}
