import { createTodoDb, deleteTodoDb, getAllTodosDb, updateTodoDb } from "./db/index.js";
import { NewTodo, Todo } from "./types.js";

const resolvers = {
  Todo: {
    id: (parent: { id: any }) => parent.id
  },
  Query: {
    async todos(_: any, __: any) {
      return getAllTodosDb();
    },
  },
  Mutation: {
    async createTodo(_: any, newTodo: NewTodo) {
      return createTodoDb(newTodo);
    },
    async updateTodo(_: any, todo: Todo) {
      return updateTodoDb(todo);
    },
    async deleteTodo(_: any, { id }: { id: Todo["id"] }) {
      return deleteTodoDb(id);
    },
  },
};

export default resolvers;
