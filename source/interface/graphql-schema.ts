import {mergeResolvers, mergeTypeDefs} from "@graphql-tools/merge";
import {gql} from "apollo-server-express";
import {faker} from "@faker-js/faker";

export abstract class Schema
{
    protected constructor()
    {
    }

    abstract resolver(): any

    abstract typeDefs(): any
}

export class GraphQLSchema
{
    resolvers: any[];
    typeDefs: any[];

    constructor(schemas: Schema[])
    {
        this.resolvers = [...schemas.map(value => value.resolver()), {
            Query: {random: () => faker.datatype.number()}
        }];
        this.typeDefs = [...schemas.map(value => value.typeDefs()), gql`
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
