import {faker} from "@faker-js/faker";
import {gql} from "apollo-server-express";

const agentsTypeDefs_ = gql`
    extend type Query
    {
    }
`;

const agentsResolver_ =
    {
        Query:
            {
                random: () => faker.datatype.number()
            }
    };

export function agentsResolver()
{
    return agentsResolver_;
}

export function agentsTypeDefs()
{
    return agentsTypeDefs_;
}
