import {mergeResolvers} from "@graphql-tools/merge";

export class Resolvers
{
    resolvers: any[]

    constructor(resolvers: any[])
    {
        this.resolvers = resolvers;
    }

    public getMergedResolvers()
    {
        return mergeResolvers(this.resolvers);
    }
}
