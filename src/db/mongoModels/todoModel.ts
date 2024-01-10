import mongoose, { Schema } from 'mongoose';

import { Todo } from '../../types.js';

const todoSchema = new Schema<Todo>(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 14,
    },
    text: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 100,
    },
  },
  {
    versionKey: false,
    strict: 'throw',
  },
);

const TodoModel = mongoose.model<Todo>('Todo', todoSchema);

export default TodoModel;
