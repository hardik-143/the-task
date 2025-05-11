import { post, get, put } from ".";

export const createProject = async (projectData) => {
  return post("/projects", projectData);
};

export const _fetchProjects = async () => {
  return get("/projects");
};

export const _fetchProjectById = async (id) => {
  return get(`/projects/${id}`);
};

export const _fetchProjectTasks = async (id, payload) => {
  return get(`/projects/${id}/tasks`, payload);
};

export const _fetchUsersForProject = async (data) => {
  return get(`/users/users-for-project`, { search: data });
};

export const _fetchProjectUsers = async (id) => {
  return get(`/projects/${id}/users`);
};

export const _updateProject = async (id, data) => {
  return put(`/projects/${id}`, data);
};
