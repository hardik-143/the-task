import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  fetchProjectById,
  fetchProjectTasks,
  setProjectDetail,
  setProjectTasks,
} from "../reducers/projectSlice";
import {
  TASK_PRIORITY_COLORS,
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "../helpers/constants";

const ProjectDetails = () => {
  const { id } = useParams();
  const { projectDetail, projectTasks } = useSelector(
    (state) => state.projects
  );
  //   const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
  });
  const dispatch = useDispatch();
  //   const [project, setProject] = useState(null);
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);
  //   const [tasks, setTasks] = useState([]);
  //   const [showAddTask, setShowAddTask] = useState(false);
  //   const [newTask, setNewTask] = useState({
  //     title: "",
  //     description: "",
  //     priority: "medium",
  //     status: "pending",
  //   });

  useEffect(() => {
    fetchProjectDetails(id);
  }, [id]);

  useEffect(() => {
    fetchTasks(id);
  }, [id, filters]);

  const fetchProjectDetails = async (id) => {
    dispatch(fetchProjectById(id)).then((res) => {
      dispatch(setProjectDetail(res.payload));
    });
  };

  const fetchTasks = async (id) => {
    let payload = {
      filters,
      project_id: id,
    };
    dispatch(fetchProjectTasks(payload)).then((res) => {
      dispatch(setProjectTasks(res.payload));
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex justify-between items-start">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-900">
            {projectDetail?.name}
          </h1>
          <p className="mt-2 text-gray-600">{projectDetail?.description}</p>
        </div>
        <Link
          to="/"
          className="bg-gray-100 inline-block  px-4 py-2 rounded-md  hover:bg-gray-200 transition-all duration-300 ease-in-out"
        >
          Back to Dashboard
        </Link>
      </div>
      <div className="filters-container">
        <div className="filter-item">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All</option>
            {TASK_STATUS_OPTIONS.map((option, index) => (
              <option value={option.value} key={index}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-item">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={filters.priority}
            onChange={(e) =>
              setFilters({ ...filters, priority: e.target.value })
            }
          >
            <option value="all">All</option>
            {TASK_PRIORITY_OPTIONS.map((option, index) => (
              <option value={option.value} key={index}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      {/* Project Header */}
      {/* <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {project?.name}
              </h1>
              <p className="mt-2 text-gray-600">{project?.description}</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
            >
              Back to Projects
            </button>
          </div>
        </div> */}

      {/* Tasks Section */}
      <div className="flex flex-1">
        <div className="grid grid-cols-3 gap-4 flex-1">
          {TASK_STATUS_OPTIONS.map((option) => (
            <div
              key={option.value}
              className="bg-[#EEEEEE] shadow rounded-lg px-2 py-6"
            >
              <div className="px-2">
                <h2>{option.label}</h2>
              </div>
              <div className="flex flex-col gap-2">
                {projectTasks
                  ?.filter((task) => task.status === option.value)
                  .map((task, index) => (
                    <div
                      key={index}
                      className={`bg-white p-2 rounded-sm border-l-2  cursor-pointer ${
                        TASK_PRIORITY_COLORS[task.priority]
                      }`}
                    >
                      <h3>{task.title}</h3>
                      <div>
                        <span>{task.priority}</span>
                        <span>{task.status}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
        {/* <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
            <button
              onClick={() => setShowAddTask(!showAddTask)}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              {showAddTask ? "Cancel" : "Add Task"}
            </button>
          </div> */}
      </div>
    </div>
  );
};

export default ProjectDetails;
