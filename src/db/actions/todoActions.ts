/* eslint-disable @typescript-eslint/no-explicit-any */
import { Error as ErrorMongoose, MongooseError, UpdateQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { NewTodo, Todo } from '../../types.js';
import { TodoModel } from '../mongoModels/index.js';

const handleDatabaseError = (error: MongooseError) => {
  console.error('Database error:', { error });
  return error;
};

function handleSchemaValidationError(error: any) {
  const validationErrors = Object.keys(error.errors).map((field) => error.errors[field].message);

  return {
    status: 409,
    error: validationErrors.join(''),
    message: 'Invalid data provided',
  };
}

function handleNotFound({ id, method }: { id: Todo['id']; method: string }) {
  console.info(`${method} id:${id} not found`);
  throw new Error(`id:${id} not found`);
}

const getAllTodosDb = async () => {
  try {
    return await TodoModel.find<Todo>().select('-_id');
  } catch (error: any) {
    return handleDatabaseError(error);
  }
};

const createTodoDb = async (newTodo: NewTodo) => {
  try {
    const createdTodo = await new TodoModel({
      ...newTodo,
      id: uuidv4(),
    }).save();
    const { _id, ...todo } = createdTodo.toObject();
    return todo as Todo;
  } catch (error: any) {
    if (error instanceof ErrorMongoose.ValidationError) {
      return handleSchemaValidationError(error);
    }

    return handleDatabaseError(error);
  }
};

const updateTodoDb = async (todo: UpdateQuery<Todo>) => {
  try {
    const updatedTodo = await TodoModel.findOneAndUpdate<Todo>({ id: todo.id }, todo, {
      new: true,
      runValidators: true,
    }).select('-_id');
    if (!updatedTodo) {
      handleNotFound({ id: todo.id, method: 'updateTodoDb' });
    }
    return updatedTodo;
  } catch (error: any) {
    return handleDatabaseError(error);
  }
};

const deleteTodoDb = async (id: Todo['id']) => {
  try {
    const todo = await TodoModel.findOneAndDelete<Todo>({ id }).select('-_id');
    if (!todo) {
      handleNotFound({ id, method: 'deleteTodoDb' });
    }
    return todo;
  } catch (error: any) {
    return handleDatabaseError(error);
  }
};

const getTodoByIdDB = async (id: any) => {
  try {
    const todo = await TodoModel.findById<Todo>(id).select('-_id');
    if (!todo) {
      handleNotFound({ id, method: 'getTodoByIdDB' });
    }
    return todo;
  } catch (error: any) {
    return handleDatabaseError(error);
  }
};

export { createTodoDb, deleteTodoDb, getAllTodosDb, getTodoByIdDB, updateTodoDb };
