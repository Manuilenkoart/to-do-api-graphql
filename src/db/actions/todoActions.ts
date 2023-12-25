import { UpdateQuery } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { TodoModel } from "../mongoModels";
import { NewTodo, Todo } from "../../types";

const handleDatabaseError = (error: Error) => {
  console.error("Database error:", error.message);
  throw new Error(`Database operation: ${error.message}`);
};

function handleSchemaValidationError(error: any) {
  const validationErrors = Object.keys(error.errors).map(

    (field) => error.errors[field].message,
  );

  return {
    status: 409,
    error: validationErrors.join(""),
    message: "Invalid data provided",
  };
}

const getAllTodosDb = async () => {
  try {
    return (await TodoModel.find().select("-_id")) as Todo[];
  } catch (error: any) {
    handleDatabaseError(error) as unknown;
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
    if (error.name === "ValidationError") {
      return handleSchemaValidationError(error) as unknown;
    }

    handleDatabaseError(error);
  }
};

const updateTodoDb = async (todo: UpdateQuery<Todo>) => {
  try {
    const updatedTodo = await TodoModel.findOneAndUpdate(
      { id: todo.id },
      todo,
      {
        new: true,
        runValidators: true,
      },
    ).select("-_id");
    if (!updatedTodo) {
      console.info("Todo not found");
    }
    return updatedTodo as Todo;
  } catch (error: any) {
    handleDatabaseError(error) as unknown;
  }
};

const deleteTodoDb = async (id: Todo["id"]) => {
  try {
    const todo = await TodoModel.findOneAndDelete({ id }).select("-_id");
    if (!todo) {
      console.info("deleteTodoDb: Todo not found");
    }
    return todo as Todo;
  } catch (error: any) {
    handleDatabaseError(error) as unknown;
  }
};

const getTodoByIdDB = async (id: any) => {
  try {
    const todo = await TodoModel.findById(id).select("-_id");
    if (!todo) {
      console.info("Todo not found");
    }
    return todo;
  } catch (error: any) {
    handleDatabaseError(error);
  }
};

export {
  getAllTodosDb,
  createTodoDb,
  deleteTodoDb,
  updateTodoDb,
  getTodoByIdDB,
};
