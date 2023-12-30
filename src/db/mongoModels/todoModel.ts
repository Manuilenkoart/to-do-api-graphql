import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
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

const TodoModel = mongoose.model('Todo', todoSchema);
export default TodoModel;
