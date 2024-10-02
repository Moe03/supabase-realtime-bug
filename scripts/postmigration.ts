// this is used to enable RLS and realtime on all tables that have the @enableRealtime prisma tag
import fs from 'fs';
import path from 'path';
const pg = require('pg');

(async () => {
    try {
        // Read the schema.prisma file
        const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
        const schemaContent = fs.readFileSync(schemaPath, 'utf-8');

        // Split the schema content into lines
        const lines = schemaContent.split('\n');

        // Variables to keep track of parsing
        let enableRealtimeModels: any[] = [];
        let currentModel: any = null;
        let currentTableName: any = null;
        let captureModel: any = false;
        let previousLine: any = '';

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            // Check for the enableRealtime comment
            if (previousLine.trim() === '/// @enableRealtime' && line.startsWith('model ')) {
                captureModel = true;

                // Extract model name
                const modelNameMatch = line.match(/^model\s+(\w+)\s+\{/);
                if (modelNameMatch) {
                    currentModel = modelNameMatch[1];
                    currentTableName = currentModel; // Default table name

                    // Look ahead for @@map to find custom table name
                    let j = i + 1;
                    while (j < lines.length && !lines[j].includes('}')) {
                        const mapMatch = lines[j].trim().match(/^@@map\("([^"]+)"\)/);
                        if (mapMatch) {
                            currentTableName = mapMatch[1];
                            break;
                        }
                        j++;
                    }

                    enableRealtimeModels.push({
                        modelName: currentModel,
                        tableName: currentTableName,
                    });
                }
                captureModel = false;
            }

            previousLine = line;
        }

        if (enableRealtimeModels.length === 0) {
            console.log('No models with @enableRealtime found.');
            process.exit(0);
        }

        // Generate SQL commands
        let sqlCommands = `
begin;

-- remove the supabase_realtime publication
drop publication if exists supabase_realtime;

-- re-create the supabase_realtime publication with no tables
create publication supabase_realtime;

`;

        enableRealtimeModels.forEach(({ modelName, tableName }) => {
            console.log(`Adding table to realtime: ${tableName}`);
            sqlCommands += `
-- add table '${tableName}' to the publication
alter publication supabase_realtime add table "${tableName}";

-- enable RLS on the table
alter table "${tableName}" enable row level security;
`;
        });

        sqlCommands += `
commit;
`;

        // Write SQL commands to a file
        const sqlFilePath = path.join(__dirname, '../prisma/post_migration.sql');
        fs.writeFileSync(sqlFilePath, sqlCommands);

        console.log('Generated SQL commands for models with @enableRealtime.');
        // run the commands on the server
        const client = new pg.Client({
            connectionString: process.env.DATABASE_URL
        });

        await client.connect();

        const res = await client.query(sqlCommands);

        await client.end();

        console.log('SQL commands executed successfully.');


    } catch (error) {
        console.error('Error generating SQL commands:', error);
        process.exit(1);
    }
})();
