import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoginForm from "./pages/auth/LoginForm";
import RegisterForm from "./pages/auth/RegisterForm";
import ProtectedRoute from "./pages/auth/ProtectedRoute";

import "./scss/main.scss";
import PublicRoute from "./pages/auth/PublicRoute";
import Logout from "./pages/auth/Logout";
import { checkAuth } from "./reducers/authSlice";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import CreateProject from "./pages/CreateProject";
import AdminRoute from "./pages/auth/AdminRoute";
import ProjectDetail from "./pages/ProjectDetail";
import { setProjectDetail } from "./reducers/projectSlice";
import TaskDetail from "./pages/TaskDetail";
import CreateTask from "./pages/CreateTask";
import EditProject from "./pages/EditProject";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(checkAuth());
    }
  }, [dispatch]);

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center">
  //         <div className="text-xl">Loading...</div>
  //       </div>
  //     );
  //   }

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
        </Route>

        {/* Protected routes */}
        <Route path="/" element={<ProtectedRoute />}>
          <Route path="/logout" element={<Logout />} />
          <Route index element={<Dashboard />} />

          <Route path="/projects/:id" element={<ProjectDetail />} />

          {/* <Route path="/" element={<AdminRoute />}> */}
          {/* </Route> */}
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/projects/:id/create-task" element={<CreateTask />} />
          <Route path="/projects/:id/edit" element={<EditProject />} />
          <Route path="/task/:id" element={<TaskDetail />} />
        </Route>

        {/* Admin routes */}

        {/* Redirect to login for unknown routes */}
        {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
