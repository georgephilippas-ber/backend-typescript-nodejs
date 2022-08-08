import {Schema} from "../../../../interface/graphql-schema";
import {gql} from "apollo-server-express";

export class SessionsSchema extends Schema
{
    typeDefs(): any
    {
        return gql`
            type Session
            {
                id: ID!
                
                createdAt: Int
                agentId: Int
            }
        `
    }

    resolver(): any
    {
        return {
            Query:
                {
                    sessionById: () => {

                    }
                }
        }
    }
}
