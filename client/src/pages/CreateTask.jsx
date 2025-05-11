import { Select } from "antd";
const { Option } = Select;
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import * as Yup from "yup";
import { handleCreateTask } from "../reducers/taskSlice";
import { debounce } from "lodash";
import { fetchProjectUsers } from "../reducers/projectSlice";
import { TASK_PRIORITY_OPTIONS } from "../helpers/constants";

const TaskSchema = Yup.object().shape({
  title: Yup.string()
    .required("Task name is required")
    .min(3, "Task name must be at least 3 characters")
    .max(50, "Task name must not exceed 50 characters"),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  assignedTo: Yup.string().required("Assigned to is required"),
});

export default function CreateTask() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const initialValues = {
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    projectId: id,
  };
  const [users, setUsers] = useState([]);

  useEffect(() => {
    dispatch(fetchProjectUsers(id)).then((res) => {
      const { data } = res.payload;
      let options = data.map((option) => ({
        label: option.username,
        value: option._id,
      }));
      setUsers(options);
    });
  }, [dispatch, id]);

  return (
    <div className="flex flex-col ">
      <div className="relative py-3 ">
        <div className="relative px-4 py-10  mx-8 md:mx-0  rounded-3xl sm:p-10">
          <div className="max-w-[600px] mx-auto">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
                Create New Task
              </h2>
              <Formik
                initialValues={initialValues}
                validationSchema={TaskSchema}
                enableReinitialize={false}
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                  dispatch(handleCreateTask(values)).then((res) => {
                    setSubmitting(false);
                    navigate(`/projects/${id}`);
                  });
                }}
              >
                {({
                  isSubmitting,
                  handleSubmit,
                  setSubmitting,
                  values,
                  setFieldValue,
                }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Title
                      </label>
                      <Field
                        type="text"
                        name="title"
                        className="mt-1 h-10 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <ErrorMessage
                        name="title"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <Field
                        as="textarea"
                        name="description"
                        rows="4"
                        className="mt-1 block w-full px-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="priority"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Priority
                      </label>
                      <Select
                        name="priority"
                        value={values.priority}
                        placeholder="Select priority"
                        style={{ width: "100%" }}
                        onChange={(value) => {
                          setFieldValue("priority", value);
                        }}
                      >
                        <Option value="">Select priority</Option>
                        {TASK_PRIORITY_OPTIONS.map((option, index) => (
                          <Option key={index} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor="assignedTo"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Assign To
                      </label>
                      <Select
                        name="assignedTo"
                        value={values.assignedTo}
                        placeholder="Select user"
                        style={{ width: "100%" }}
                        onChange={(value) => {
                          setFieldValue("assignedTo", value);
                        }}
                        allowClear
                      >
                        {users.map((user) => (
                          <Option key={user.value} value={user.value}>
                            {user.label}
                          </Option>
                        ))}
                      </Select>
                      <ErrorMessage
                        name="assignedTo"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitting(true);
                        handleSubmit();
                      }}
                      disabled={isSubmitting}
                      className="w-full bg-blue-500 text-white p-2 rounded-md"
                    >
                      {isSubmitting ? "Creating..." : "Create Task"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
