import 'dotenv/config';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

import { connectToMongoDB } from './db/index.js';
import resolvers from './graphql/resolvers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const port = process.env.SERVER_PORT;
const app = express();

const typeDefs = gql(
  readFileSync(resolve(__dirname, '../src/graphql', 'schema.graphql'), {
    encoding: 'utf-8',
  }),
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  includeStacktraceInErrorResponses: process.env.NODE_ENV !== 'production',
});

await server.start();

app.use('/graphql', cors(), express.json(), expressMiddleware(server));

app.get('/health', (req, res) => {
  res.status(200).send('Okay! 🚀');
});

app.listen(port, () => {
  console.log(`Server is running on ${process.env.NODE_ENV} mode http://localhost:${port}`);
  console.log(`Graphql is running on ${process.env.NODE_ENV} mode http://localhost:${port}/graphql`);
});

connectToMongoDB();
