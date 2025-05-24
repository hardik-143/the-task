import { useSelector, useDispatch } from "react-redux";
import { handleLogout } from "../reducers/authSlice";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { fetchProjects } from "../reducers/projectSlice";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const { projects } = useSelector((state) => state.projects);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProjects());
  }, []);
  return (
    <>
      <div className="flex flex-col ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Projects</h2>
            <Link
              to="/projects/create"
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Create Project
            </Link>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {projects.map((project, index) => (
            <Link
              to={`/projects/${project._id}`}
              key={index}
              className="bg-white p-4 rounded-md shadow-md"
            >
              <h3 className="text-lg font-semibold">{project.name}</h3>
              <p className="text-sm text-gray-600">{project.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
