import { get, put, del, post } from ".";

export const _fetchTaskById = async (id) => {
  return get(`/tasks/${id}`);
};

export const _updateTaskDetail = async (data) => {
  const { id } = data;
  return put(`/tasks/${id}`, data);
};

export const _deleteTask = async (id) => {
  return del(`/tasks/${id}`);
};


export const _createTask = async (data) => {
  return post(`/tasks`, data);
};
