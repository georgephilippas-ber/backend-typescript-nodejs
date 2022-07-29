import Fastify, {FastifyInstance} from "fastify";

class Server
{
    fastify: FastifyInstance

    constructor()
    {
        this.fastify = Fastify();
    }

    listen(port: number = 4000)
    {
        this.fastify.listen({port}).then(value => console.log(value));
    }
}

const server = new Server();

server.listen();
