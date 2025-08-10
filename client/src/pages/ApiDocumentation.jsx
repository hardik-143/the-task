import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { getMethodColor } from "../helpers/utils";

const ApiCallexample = ({ route }) => {
  const contentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("request");

  return (
    <div className=" rounded-lg overflow-hidden bg-white shadow-sm border border-[#222831]">
      <div
        className="bg-gray-50 p-4 flex items-center gap-4"
        role="button"
        aria-expanded={isOpen}
        aria-controls={`collapsible-${route.path}`}
        onClick={() =>
          // toggleTab(
          //   index,
          //   activeTab[index] === null ? "request" : null
          // )
          setIsOpen(!isOpen)
        }
      >
        <span
          className="px-3 py-1 rounded text-white font-medium text-sm"
          style={{ backgroundColor: getMethodColor(route.method) }}
        >
          {route.method}
        </span>
        <h3 className="text-lg font-medium">{route.path}</h3>
      </div>
      <div
        ref={contentRef}
        role="region"
        aria-labelledby={`collapsible-${route.path}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out  border-t  border-[#222831] ${
          isOpen ? "visible" : "hidden"
        }`}
      >
        <div className="p-4">
          <p className="text-gray-600 mb-4">{route.description}</p>
          <div className="border rounded-lg overflow-hidden">
            <div className="flex border-b">
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "request"
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("request")}
              >
                Request
              </button>
              <button
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "response"
                    ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("response")}
              >
                Response
              </button>
            </div>
            <div className="p-4">
              {activeTab === "request" && (
                <div className="overflow-auto max-h-[300px]">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(route.example.request, null, 2)}
                  </pre>
                </div>
              )}
              {activeTab === "response" && (
                <div className="overflow-auto max-h-[300px]">
                  <pre className="text-sm whitespace-pre-wrap">
                    {JSON.stringify(route.example.response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ApiDocumentation = () => {
  // const [activeTab, setActiveTab] = useState({});
  const apiRoutes = [
    // {
    //   group: "Authentication",
    //   routes: [
    //     {
    //       method: "POST",
    //       path: "/api/auth/register",
    //       description: "Register a new user",
    //       example: {
    //         request: {
    //           username: "john_doe",
    //           email: "john@example.com",
    //           password: "securepassword123",
    //         },
    //         response: {
    //           message: "User registered successfully",
    //           user: {
    //             id: "user_id",
    //             username: "john_doe",
    //             email: "john@example.com",
    //             apiKey: "generated_api_key",
    //           },
    //           token: "session_token",
    //         },
    //       },
    //     },
    //     {
    //       method: "POST",
    //       path: "/api/auth/login",
    //       description: "Login an existing user",
    //       example: {
    //         request: {
    //           email: "john@example.com",
    //           password: "securepassword123",
    //         },
    //         response: {
    //           message: "Login successful",
    //           user: {
    //             id: "user_id",
    //             username: "john_doe",
    //             email: "john@example.com",
    //             apiKey: "user_api_key",
    //           },
    //           token: "session_token",
    //         },
    //       },
    //     },
    //     {
    //       method: "GET",
    //       path: "/api/auth/check",
    //       description: "Check if user is authenticated",
    //       example: {
    //         headers: {
    //           Authorization: "Bearer session_token",
    //         },
    //         response: {
    //           message: "User is authenticated",
    //           user: {
    //             id: "user_id",
    //             username: "john_doe",
    //             email: "john@example.com",
    //           },
    //         },
    //       },
    //     },
    //     {
    //       method: "POST",
    //       path: "/api/auth/generate-new-api-key",
    //       description: "Generate a new API key for the authenticated user",
    //       example: {
    //         headers: {
    //           Authorization: "Bearer session_token",
    //         },
    //         response: {
    //           message: "New API key generated",
    //           apiKey: "new_generated_api_key",
    //         },
    //       },
    //     },
    //   ],
    // },
    {
      group: "Todo Operations",
      routes: [
        {
          method: "POST",
          path: "/api/todo/create",
          description: "Create a new todo item",
          example: {
            request: {
              todo: "Complete the project",
              apiKey: "user_api_key",
            },
            response: {
              message: "Todo created successfully",
              todo: {
                id: "todo_id",
                todo: "Complete the project",
                created_by: "user_id",
                createdAt: "timestamp",
                updatedAt: "timestamp",
              },
            },
          },
        },
        {
          method: "GET",
          path: "/api/todo",
          description: "Get all todos for the authenticated user",
          example: {
            request: {
              apiKey: "user_api_key",
            },
            response: {
              message: "Todos fetched successfully",
              todos: [
                {
                  id: "todo_id",
                  todo: "Complete the project",
                  created_by: "user_id",
                  createdAt: "timestamp",
                  updatedAt: "timestamp",
                },
              ],
            },
          },
        },
        {
          method: "PUT",
          path: "/api/todo/update",
          description: "Update a todo item",
          example: {
            request: {
              id: "todo_id",
              todo: "Complete the project",
              apiKey: "user_api_key",
            },
            response: {
              message: "Todo updated successfully",
            },
          },
        },
        {
          method: "GET",
          path: "/api/todo/:id",
          description: "Get a specific todo by ID",
          example: {
            request: {
              id: "todo_id",
              apiKey: "user_api_key",
            },
            response: {
              message: "Todo fetched successfully",
              todo: {
                id: "todo_id",
                todo: "Complete the project",
                created_by: "user_id",
                createdAt: "timestamp",
                updatedAt: "timestamp",
              },
            },
          },
        },
        {
          method: "DELETE",
          path: "/api/todo/delete",
          description: "Delete a todo item",
          example: {
            request: {
              id: "todo_id",
              apiKey: "user_api_key",
            },
            response: {
              message: "Todo deleted successfully",
            },
          },
        },
      ],
    },
  ];

  // const toggleTab = (routeIndex, tab) => {
  //   setActiveTab((prev) => ({
  //     ...prev,
  //     [routeIndex]: prev[routeIndex] === tab ? null : tab,
  //   }));
  // };

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-8">API Documentation</h1>

      {apiRoutes.map((group) => (
        <div key={group.group} className="mb-8">
          {/* <h2 className="text-2xl font-semibold mb-4">{group.group}</h2> */}
          <div className="space-y-4">
            {group.routes.map((route, index) => {
              return <ApiCallexample route={route} key={index} />;
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApiDocumentation;
