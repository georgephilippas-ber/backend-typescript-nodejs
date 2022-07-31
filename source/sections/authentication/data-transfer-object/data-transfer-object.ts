export class dtoSession
{
    agentId!: number;
    sessionId!: number;

    static validate(session: dtoSession)
    {
        return Boolean(session.agentId && session.sessionId);
    }
}
