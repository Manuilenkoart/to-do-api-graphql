import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { expressMiddleware } from '@apollo/server/express4';
import resolvers from './resolvers.js';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { connectToMongoDB } from './db/index.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename);

const port = process.env.SERVER_PORT;
const app = express();

app.use(cors());
app.use(express.json());

const typeDefs = gql(
  readFileSync(resolve(__dirname, '../src', 'schema.graphql'), {
    encoding: 'utf-8',
  }),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use('/graphql', cors(), express.json(), expressMiddleware(server));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`graphql is running on http://localhost:${port}/graphql`);
});

connectToMongoDB();
