/* eslint-disable @typescript-eslint/no-explicit-any */
import { MongooseError, UpdateQuery } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

import { NewTodo, Todo } from '../../types.js';
import { TodoModel } from '../mongoModels/index.js';

const handleDatabaseError = (error: MongooseError) => {
  console.error('Database error:', { error });

  throw new Error(JSON.stringify(error));
};

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
    return handleDatabaseError(error);
  }
};

const updateTodoDb = async (todo: UpdateQuery<Todo>) => {
  try {
    return await TodoModel.findOneAndUpdate<Todo>({ id: todo.id }, todo, {
      new: true,
      runValidators: true,
    }).select('-_id');
  } catch (error: any) {
    return handleDatabaseError(error);
  }
};

const deleteTodoDb = async (id: Todo['id']) => {
  try {
    return await TodoModel.findOneAndDelete<Todo>({ id }).select('-_id');
  } catch (error: any) {
    return handleDatabaseError(error);
  }
};

export { createTodoDb, deleteTodoDb, getAllTodosDb, updateTodoDb };
