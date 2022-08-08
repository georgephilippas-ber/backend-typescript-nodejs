import {gql} from "apollo-server-express";
import {Schema} from "../../../../interface/graphql-schema";
import {AgentsManager} from "../managers/agents-manager";

export class AgentsSchema extends Schema
{
    agentsManager: AgentsManager;

    public constructor(agentsManager: AgentsManager)
    {
        super();

        this.agentsManager = agentsManager;
    }

    typeDefs(): any
    {
        return gql`
            type Agent
            {
                id: ID!

                username: String
                email: String
            }

            extend type Query
            {
                allAgents: [Agent!]
            }
        `;
    }

    resolver(): any
    {
        return {
            Query:
                {
                    allAgents: () =>
                    {
                        return this.agentsManager.all();
                    }
                }
        }
    }
}
