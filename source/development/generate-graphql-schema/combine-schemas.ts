import {readdirSync, readFileSync, writeFileSync} from "fs";
import path from "path";

function combineSchemas(startDir: string = process.cwd(), include_schemas: string[] = ["schema.graphql"])
{
    let globalSchema: string = "";

    function fromDirectory(directory: string)
    {
        let contents = readdirSync(directory, {withFileTypes: true});

        for (let content of contents)
        {
            if (content.isDirectory())
                fromDirectory(path.join(directory, content.name));
            else if (include_schemas.includes(content.name))
                globalSchema = globalSchema.concat(readFileSync(path.join(directory, content.name)).toString("utf-8"));
        }
    }

    fromDirectory(startDir);

    return globalSchema;
}

combineSchemas();
