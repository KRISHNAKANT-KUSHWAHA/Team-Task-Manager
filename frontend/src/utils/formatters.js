export const formatDate = (date) => {
  if (!date) {
    return "No date";
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));
};

export const getErrorMessage = (error) => {
  return error?.response?.data?.message || error.message || "Something went wrong";
};

export const priorityClasses = {
  Low: "bg-sky-50 text-sky-700 border-sky-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  High: "bg-red-50 text-red-700 border-red-200"
};

export const statusClasses = {
  "To Do": "bg-slate-100 text-slate-700",
  "In Progress": "bg-indigo-50 text-indigo-700",
  Done: "bg-emerald-50 text-emerald-700"
};
