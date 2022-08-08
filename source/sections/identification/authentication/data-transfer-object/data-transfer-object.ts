export class dtoSession
{
    agentId!: number;
    sessionId!: number;

    static validate(session: dtoSession): boolean
    {
        console.log(Boolean(session.agentId && session.sessionId));

        return Boolean(session.agentId && session.sessionId);
    }
}
