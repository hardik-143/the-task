import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { fetchProjectById } from "../reducers/projectSlice";

const ProjectDetails = () => {
  const { id } = useParams();
  //   const navigate = useNavigate();
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

  const fetchProjectDetails = async (id) => {
    dispatch(fetchProjectById(id)).then((res) => {
      console.log("res", res);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        <div className="bg-white shadow rounded-lg p-6">
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
    </div>
  );
};

export default ProjectDetails;
