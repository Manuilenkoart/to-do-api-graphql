import mongoose, { Document, Schema } from 'mongoose';

interface TodoModelDocument extends Document {
  id: string;
  title: string;
  text: string;
}

const todoSchema = new Schema(
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

const TodoModel = mongoose.model<TodoModelDocument>('Todo', todoSchema);

export default TodoModel;
