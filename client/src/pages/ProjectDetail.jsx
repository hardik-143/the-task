import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Select } from "antd";
const { Option } = Select;
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
import { updateTaskDetail } from "../reducers/taskSlice";
const DragDropBoard = ({ projectTasks, setProjectTasks }) => {
  const dispatch = useDispatch();
  const [draggedTask, setDraggedTask] = useState(null);

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const updateTaskStatus = async (taskId, status) => {
    dispatch(updateTaskDetail({ id: taskId, status })).then((res) => {
      console.log("res", res);
    });
  };

  const handleDrop = (status) => {
    if (!draggedTask) return;
    let newTasks = projectTasks.map((task) =>
      task === draggedTask ? { ...task, status } : task
    );
    setProjectTasks(newTasks);
    setDraggedTask(null);
    updateTaskStatus(draggedTask._id, status);
  };

  const allowDrop = (e) => e.preventDefault();

  return (
    <div className="grid grid-cols-3 gap-4  w-full">
      {TASK_STATUS_OPTIONS.map((option) => (
        <div
          key={option.value}
          onDrop={() => handleDrop(option.value)}
          onDragOver={allowDrop}
          className="bg-[#EEEEEE] shadow rounded-lg px-2 py-4 min-h-[300px]"
        >
          <div className="px-2 mb-2">
            <h2 className="font-bold text-lg">{option.label}</h2>
          </div>
          <div className="flex flex-col gap-2">
            {projectTasks
              .filter((task) => task.status === option.value)
              .map((task, index) => (
                <Link
                  key={index}
                  to={`/task/${task._id}`}
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  className={`bg-white p-2 rounded-sm border-l-4 cursor-grab shadow-sm ${
                    TASK_PRIORITY_COLORS[task.priority].borderLeftColor
                  }`}
                >
                  <h3 className="font-medium">{task.title}</h3>
                  {/* <div className="text-sm text-gray-600">
                    <span>{task.priority}</span> | <span>{task.status}</span>
                  </div> */}
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};
const ProjectDetail = () => {
  const { id } = useParams();
  const [projectDetail, setProjectDetail] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const { user } = useSelector((state) => state.auth);
  //   const navigate = useNavigate();

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    assigned_to: "all",
  });
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchProjectDetails(id);
  }, [id]);

  useEffect(() => {
    fetchTasks(id);
  }, [id, filters]);

  const fetchProjectDetails = async (id) => {
    dispatch(fetchProjectById(id)).then((res) => {
      let projectDetail = res.payload;
      if (projectDetail?.createdBy?._id === user?.id) {
        setIsProjectOwner(true);
      } else {
        setIsProjectOwner(false);
      }
      setProjectDetail(projectDetail);
    });
  };

  const fetchTasks = async (id) => {
    let payload = {
      filters,
      project_id: id,
    };
    dispatch(fetchProjectTasks(payload)).then((res) => {
      setProjectTasks(res.payload);
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
        <div className="flex gap-2">
          {isProjectOwner && (
            <Link
              to={`/projects/${id}/edit`}
              className="bg-gray-100 inline-block  px-4 py-2 rounded-md  hover:bg-gray-200 transition-all duration-300 ease-in-out"
            >
              Edit Project
            </Link>
          )}
          <Link
            to={`/projects/${id}/create-task`}
            className="bg-gray-100 inline-block  px-4 py-2 rounded-md  hover:bg-gray-200 transition-all duration-300 ease-in-out"
          >
            Create Task
          </Link>
          <Link
            to="/"
            className="bg-gray-100 inline-block  px-4 py-2 rounded-md  hover:bg-gray-200 transition-all duration-300 ease-in-out"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
      <div className="filters-container flex gap-4 py-2">
        <div className="filter-item flex gap-2 items-center">
          <label htmlFor="status">Status</label>
          <Select
            id="status"
            value={filters.status}
            className="min-w-[150px]"
            onChange={(value) => setFilters({ ...filters, status: value })}
          >
            <Option value="all">All</Option>
            {TASK_STATUS_OPTIONS.map((option, index) => (
              <Option value={option.value} key={index}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
        <div className="filter-item flex gap-2 items-center">
          <label htmlFor="priority">Priority</label>
          <Select
            id="priority"
            value={filters.priority}
            className="min-w-[150px]"
            onChange={(value) => setFilters({ ...filters, priority: value })}
          >
            <Option value="all">All</Option>
            {TASK_PRIORITY_OPTIONS.map((option, index) => (
              <Option value={option.value} key={index}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
        <div className="filter-item flex gap-2 items-center">
          <label htmlFor="assigned_to">Assigned To</label>
          <Select
            id="assigned_to"
            value={filters.assigned_to}
            className="min-w-[150px]"
            onChange={(value) => setFilters({ ...filters, assigned_to: value })}
          >
            <Option value="all">All</Option>
            {projectDetail?.users?.map((user, index) => (
              <Option value={user._id} key={index}>
                {user.username}
              </Option>
            ))}
          </Select>
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
        <DragDropBoard
          projectTasks={projectTasks}
          setProjectTasks={setProjectTasks}
        />
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

export default ProjectDetail;
