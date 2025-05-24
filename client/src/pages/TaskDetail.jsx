import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteTask,
  fetchTaskById,
  setTaskDetail,
  updateTaskDetail,
} from "../reducers/taskSlice";
import { Tooltip } from "antd";

import { useEffect, useState } from "react";
import {
  TASK_PRIORITY_OPTIONS,
  TASK_STATUS_OPTIONS,
} from "../helpers/constants";
import { Select } from "antd";
const { Option } = Select;
export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isProjectOwner, setIsProjectOwner] = useState(false);
  const [isTaskOwner, setIsTaskOwner] = useState(false);
  const [isTaskAssignedToMe, setIsTaskAssignedToMe] = useState(false);
  const [taskDetail, setTaskDetail] = useState(null);

  const updateTaskPermissions = (taskDetail) => {
    if (taskDetail?.created_by?._id === user?.id) {
      setIsTaskOwner(true);
    } else {
      setIsTaskOwner(false);
    }
    if (taskDetail?.project?.createdBy?._id === user?.id) {
      setIsProjectOwner(true);
    } else {
      setIsProjectOwner(false);
    }
    if (taskDetail?.assigned_to?._id === user?.id) {
      setIsTaskAssignedToMe(true);
    } else {
      setIsTaskAssignedToMe(false);
    }
  };

  useEffect(() => {
    dispatch(fetchTaskById(id)).then((res) => {
      let taskDetail = res.payload;
      updateTaskPermissions(taskDetail);
      setTaskDetail(taskDetail);
    });
  }, [id]);

  const handleTaskDetailChange = (value, key) => {
    dispatch(updateTaskDetail({ id, [key]: value })).then((res) => {
      let taskDetail = res.payload;
      updateTaskPermissions(taskDetail);
      setTaskDetail(taskDetail);
    });
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col gap-4">
        <div className="">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {taskDetail?.title}
            </h1>
            {isTaskOwner && (
              <div>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    dispatch(deleteTask(id)).then((res) => {
                      navigate(`/projects/${taskDetail?.project?._id}`);
                    });
                  }}
                >
                  Delete Task
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex gap-2 items-center">
            <label htmlFor="status" className="text-gray-600">
              Status
            </label>
            <Tooltip
              title={
                !isTaskAssignedToMe && !isProjectOwner
                  ? "Only task assigned to me or project owner can change status"
                  : null
              }
            >
              <Select
                id="status"
                value={taskDetail?.status}
                className="min-w-[150px]"
                onChange={(value) => {
                  handleTaskDetailChange(value, "status");
                }}
                disabled={!isTaskAssignedToMe && !isProjectOwner} // only task assigned to me or project owner can change status
              >
                {TASK_STATUS_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Tooltip>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="priority" className="text-gray-600">
              Priority
            </label>
            <Tooltip
              title={
                !isTaskOwner && !isProjectOwner
                  ? "Only task owner [who created the task] or project owner can change priority"
                  : null
              }
            >
              <Select
                value={taskDetail?.priority}
                className="min-w-[150px]"
                onChange={(value) => {
                  handleTaskDetailChange(value, "priority");
                }}
                disabled={!isTaskOwner && !isProjectOwner} // only task owner [who created the task] or project owner can change priority
              >
                {TASK_PRIORITY_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Tooltip>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="assigned_to" className="text-gray-600">
              Assigned To
            </label>
            <Select
              value={taskDetail?.assigned_to?._id}
              className="min-w-[150px]"
              onChange={(value) => {
                handleTaskDetailChange(value, "assigned_to");
              }}
            >
              {taskDetail?.project?.users?.map((_user, index) => (
                <Option key={index} value={_user._id}>
                  {_user._id === user?.id ? "Me" : _user.username}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900">Task Description</h2>
          <div
            className={` ${
              !taskDetail?.description
                ? "italic text-gray-400"
                : "text-gray-600"
            }`}
          >
            {taskDetail?.description || "No description"}
          </div>
        </div>
        <hr />
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-gray-900">Task Comments</h2>
          <div>
            <div className="flex flex-col gap-4">
              <p>
                Task Created at {taskDetail?.created_at} by{" "}
                {isTaskOwner ? "You" : taskDetail?.created_by?.username}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
