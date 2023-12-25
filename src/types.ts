export type NewTodo = {
  title: string;
  text: string;
};
export type Todo = NewTodo & {
  id: string;
};
