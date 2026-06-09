
const STATUS_CLASS = {
  draft: "text-gray-600 bg-gray-200",
  cancelled: "text-gray-600 bg-gray-200",
  pending: "text-yellow-700 bg-yellow-200",
  paid: "text-green-700 bg-green-200",
  completed: "text-green-700 bg-green-200",
  active: "text-green-700 bg-green-200",
  partial: "text-blue-700 bg-blue-200",
  scheduled: "text-blue-700 bg-blue-200",
  missed: "text-red-700 bg-red-200",
  failed: "text-red-700 bg-red-200",
  deactive: "text-red-700 bg-red-200",
  refunded: "text-purple-700 bg-purple-200",
  default: "text-gray-700 bg-gray-200",
};

const ACTION_STATUS_CLASS = {
  "no action": "text-gray-600 bg-gray-200",
  "no answer": "text-yellow-700 bg-yellow-200",
  invalid: "text-red-700 bg-red-200",
  "in loop": "text-purple-700 bg-purple-200",
  general: "text-yellow-700 bg-yellow-200",
  interested: "text-green-700 bg-green-200",
  "not interested": "text-red-700 bg-red-200",
  schedule: "text-blue-700 bg-blue-200",
  active: "text-green-700 bg-green-200",
  'de active': "text-red-700 bg-red-200",
  'SUBADMIN': "text-gray-700 bg-gray-200",
  'DEP_ADMIN': "text-yellow-700 bg-yellow-200",
  'HR_ADMIN': "text-green-700 bg-green-200",
  'FINANCE_ADMIN': "text-blue-700 bg-blue-200",
  'USER': "text-blue-700 bg-blue-200",
  
};
export const getActionStatusColor = (s) =>ACTION_STATUS_CLASS[s] || ACTION_STATUS_CLASS.default;

export const getStatusColor = (s) => STATUS_CLASS[s] || STATUS_CLASS.default;