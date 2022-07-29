import {readdirSync, readFileSync, writeFile, writeFileSync} from "fs";
import path from "path";

function combineSchemas(startDir: string = process.cwd(), schemas: string[] = ["schema.graphql"], toFile: boolean = true)
{
    let globalSchema: string = "";

    function fromDirectory(directory: string)
    {
        let contents = readdirSync(directory, {withFileTypes: true});

        for (let content of contents)
        {
            if (content.isDirectory())
                fromDirectory(path.join(directory, content.name));
            else if (schemas.includes(content.name))
                globalSchema = globalSchema.concat(readFileSync(path.join(directory, content.name)).toString("utf-8"));
        }
    }

    fromDirectory(startDir);

    if (toFile)
        writeFileSync(path.join(process.cwd(), "source", "sections", "root", "GraphQL", "combined.graphql"), globalSchema);

    return globalSchema;
}

combineSchemas();