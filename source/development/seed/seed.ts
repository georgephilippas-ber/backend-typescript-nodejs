import {seed as seedAgents} from "./entities/agents"

export async function seed(agentsCardinality: number = 0x02)
{
    await seedAgents(agentsCardinality);
}

seed();
