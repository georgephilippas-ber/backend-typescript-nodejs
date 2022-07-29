import {seed as seedAgents} from "./agents"

export async function seed(agentsCardinality: number = 0x02)
{
    await seedAgents(agentsCardinality);
}
