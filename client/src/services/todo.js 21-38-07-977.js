import { get } from ".";
// import { store } from "../store";

const commonPostData = {
  //   apiKey: store.getState().auth.user.apiKey,
};

export const fetchTodos = async () => {
  return get("/todos", commonPostData);
};
