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

export const TASK_PRIORITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
};

export const TASK_PRIORITY_COLORS = {
  [TASK_PRIORITY.LOW]: "border-l-green-500",
  [TASK_PRIORITY.MEDIUM]: "border-l-yellow-500",
  [TASK_PRIORITY.HIGH]: "border-l-red-500",
};

export const TASK_PRIORITY_OPTIONS = [
  { label: "Low", value: TASK_PRIORITY.LOW },
  { label: "Medium", value: TASK_PRIORITY.MEDIUM },
  { label: "High", value: TASK_PRIORITY.HIGH },
];
