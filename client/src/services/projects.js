import { post, get } from ".";

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
