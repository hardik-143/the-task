import React, { useMemo, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  fetchUsersForProject,
  handleCreateProject,
} from "../reducers/projectSlice";
import { useDispatch } from "react-redux";
import { Select, Spin } from "antd";
import { useRef, useEffect } from "react";
import { debounce } from "lodash";

// Validation schema
const ProjectSchema = Yup.object().shape({
  name: Yup.string()
    .required("Project name is required")
    .min(3, "Project name must be at least 3 characters")
    .max(50, "Project name must not exceed 50 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
});

const DebounceSelect = ({ fetchOptions, debounceTimeout, ...props }) => {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);
  const dispatch = useDispatch();

  const onSearch = (search) => {
    setFetching(true);
    dispatch(fetchUsersForProject(search)).then((res) => {
      let options = res.payload.map((option) => ({
        label: option.username,
        value: option._id,
      }));
      setOptions(options);
      setFetching(false);
    });
  };

  return (
    <Select
      labelInValue
      {...props}
      onSearch={(value) => {
        debounce(onSearch, 300)(value);
      }}
      filterOption={false}
      // loading={fetching}
      // notFoundContent={fetching ? <Spin /> : null}
      options={options}
      optionRender={(option) => {
        return <div>{option.label}</div>;
      }}
    />
  );
};

const CreateProject = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    name: "",
    description: "",
    users: [],
  };

  return (
    <div className="flex flex-col ">
      <div className="relative py-3 ">
        <div className="relative px-4 py-10  mx-8 md:mx-0  rounded-3xl sm:p-10">
          <div className="max-w-[600px] mx-auto">
            <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
              <h2 className="text-2xl font-bold mb-8 text-center text-gray-900">
                Create New Project
              </h2>
              <Formik
                initialValues={initialValues}
                validationSchema={ProjectSchema}
                enableReinitialize={false}
                onSubmit={async (values, { setSubmitting, setStatus }) => {
                  dispatch(handleCreateProject(values)).then((res) => {
                    setSubmitting(false);
                    navigate("/");
                  });
                }}
              >
                {({
                  isSubmitting,

                  handleSubmit,
                  setSubmitting,
                  setFieldValue,
                }) => (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Project Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <ErrorMessage
                        name="name"
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <ErrorMessage
                        name="description"
                        component="div"
                        className="text-red-500 text-sm mt-1"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="users"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Users
                      </label>
                      <DebounceSelect
                        debounceTimeout={300}
                        name="users"
                        mode="multiple"
                        placeholder="Select users"
                        style={{ width: "100%" }}
                        onChange={(value) => {
                          setFieldValue(
                            "users",
                            value.map((user) => user.value)
                          );
                        }}
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitting(true);
                          handleSubmit();
                        }}
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {isSubmitting ? "Creating..." : "Create Project"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
