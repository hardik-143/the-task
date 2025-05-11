export const API_URL = import.meta.env.VITE_API_URL;

export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const TASK_STATUS_OPTIONS = [
  { label: "Pending", value: TASK_STATUS.PENDING },
  { label: "In Progress", value: TASK_STATUS.IN_PROGRESS },
  { label: "Completed", value: TASK_STATUS.COMPLETED },
];

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.PENDING]: {
    borderLeftColor: "border-l-yellow-500",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
  [TASK_STATUS.IN_PROGRESS]: {
    borderLeftColor: "border-l-blue-500",
    borderColor: "border-blue-500",
    bgColor: "bg-blue-500",
    textColor: "text-blue-500",
  },
  [TASK_STATUS.COMPLETED]: {
    borderLeftColor: "border-l-green-500",
    borderColor: "border-green-500",
    bgColor: "bg-green-500",
    textColor: "text-green-500",
  },
};

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const TASK_PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: {
    borderLeftColor: "border-l-green-500",
    borderColor: "border-green-500",
    bgColor: "bg-green-500",
    textColor: "text-green-500",
  },
  [TASK_PRIORITY.MEDIUM]: {
    borderLeftColor: "border-l-yellow-500",
    borderColor: "border-yellow-500",
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-500",
  },
  [TASK_PRIORITY.HIGH]: {
    borderLeftColor: "border-l-red-500",
    borderColor: "border-red-500",
    bgColor: "bg-red-500",
    textColor: "text-red-500",
  },
};

export const TASK_PRIORITY_OPTIONS = [
  { label: "Low", value: TASK_PRIORITY.LOW },
  { label: "Medium", value: TASK_PRIORITY.MEDIUM },
  { label: "High", value: TASK_PRIORITY.HIGH },
];
