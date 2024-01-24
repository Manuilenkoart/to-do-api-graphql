import { GraphQLError } from 'graphql';

import { createTodoDb, deleteTodoDb, getAllTodosDb, updateTodoDb } from './db/index.js';
import { MutationUpdateTodoArgs, Resolvers } from './generated/graphql.js';
import { NewTodo, Todo } from './types.js';

const resolvers: Resolvers = {
  Query: {
    async todos() {
      try {
        return await getAllTodosDb();
      } catch (error) {
        throw new GraphQLError('error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', error },
        });
      }
    },
  },
  Mutation: {
    async createTodo(_: unknown, newTodo: NewTodo) {
      try {
        return await createTodoDb(newTodo);
      } catch (error) {
        throw new GraphQLError('error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', error },
        });
      }
    },
    async updateTodo(_: unknown, args: MutationUpdateTodoArgs) {
      try {
        const { id, ...todo } = args;

        const updatedTodo = await updateTodoDb({ id, ...todo });

        if (!updatedTodo) {
          throw new GraphQLError(`id:${id} not found`, {
            extensions: { code: 'INVALID_DATA_PROVIDED', updatedTodo },
          });
        }
        return updatedTodo;
      } catch (error) {
        throw new GraphQLError('error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', error },
        });
      }
    },
    async deleteTodo(_: unknown, { id }: { id: Todo['id'] }) {
      try {
        const deletedTodo = await deleteTodoDb(id);
        if (!deletedTodo) {
          throw new GraphQLError(`id:${id} not found`, {
            extensions: { code: 'INVALID_DATA_PROVIDED', deletedTodo },
          });
        }
        return deletedTodo;
      } catch (error) {
        throw new GraphQLError('error', {
          extensions: { code: 'INTERNAL_SERVER_ERROR', error },
        });
      }
    },
  },
};

export default resolvers;
