import {faker} from "@faker-js/faker";

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
