import {seed as seedAgents} from "./entities/agents"

export async function seed(agentsCardinality: number = 0x10): Promise<void>
{
    await seedAgents(agentsCardinality);
}

seed().then(value => undefined);
