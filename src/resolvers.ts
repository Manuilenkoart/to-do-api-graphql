import { createTodoDb, deleteTodoDb, getAllTodosDb, updateTodoDb } from './db/index.js';
import { NewTodo, Todo } from './types.js';

const resolvers = {
  Todo: {
    id: (parent: { id: string }) => parent.id,
  },
  Query: {
    async todos() {
      return getAllTodosDb();
    },
  },
  Mutation: {
    async createTodo(_: unknown, newTodo: NewTodo) {
      return createTodoDb(newTodo);
    },
    async updateTodo(_: unknown, todo: Todo) {
      return updateTodoDb(todo);
    },
    async deleteTodo(_: unknown, { id }: { id: Todo['id'] }) {
      return deleteTodoDb(id);
    },
  },
};

export default resolvers;
