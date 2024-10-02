// index.js

import express from 'express';
import prisma from './prismaClient';
import dotenv from 'dotenv';
import { SupabaseClient } from '@supabase/supabase-js';
import moment from 'moment';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const supabase = new SupabaseClient(process.env.SUPABASE_URL || "", process.env.SUPABASE_SECRET_KEY || ""); // this should use the service role key.

app.use(express.json());

app.get('/', (req: any, res: any) => {
    res.send('Hello World');
});

app.get("/test", async (req: any, res: any) => {
    // create new user

    //setup realtime listener to listen for changes in the user table
    const channel = supabase
        .channel('*')
        .on(
            'postgres_changes' as any,
            {
                event: '*',
                schema: 'public' as any,
            } as any,
            async (payload: { new: any }) => {

                console.log('New Payload: ', payload);
            }
        )
        .subscribe(async (status: string) => {
            if (status === 'SUBSCRIBED') {
                console.log('Realtime subscription to User table established.');

                // try to create a new user..
                const newUser = await prisma.user.create({
                    data: {
                        email: `test_${moment().unix()}@test.com`,
                        name: "Test User",
                    },
                });
                console.log(`created new user, should be in realtime ?`)
            }
        });

    res.json({
        done: true
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
