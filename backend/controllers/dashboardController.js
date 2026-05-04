import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const projectQuery =
      req.user.role === "Admin"
        ? { members: req.user._id }
        : { members: req.user._id };

    const projects = await Project.find(projectQuery).select("_id");
    const projectIds = projects.map((project) => project._id);

    const taskQuery = { projectId: { $in: projectIds } };
    if (req.user.role === "Member") {
      taskQuery.assignedTo = req.user._id;
    }

    const [totalTasks, tasksByStatus, tasksPerUser, overdueTasks] = await Promise.all([
      Task.countDocuments(taskQuery),
      Task.aggregate([
        { $match: taskQuery },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: taskQuery },
        { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 0,
            userId: "$user._id",
            name: "$user.name",
            email: "$user.email",
            count: 1
          }
        }
      ]),
      Task.find({
        ...taskQuery,
        dueDate: { $lt: today },
        status: { $ne: "Done" }
      })
        .populate("assignedTo", "name email role")
        .populate("projectId", "title")
        .sort({ dueDate: 1 })
    ]);

    const statusCounts = {
      "To Do": 0,
      "In Progress": 0,
      Done: 0
    };

    tasksByStatus.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    res.json({
      totalTasks,
      tasksByStatus: statusCounts,
      tasksPerUser,
      overdueTasks
    });
  } catch (error) {
    next(error);
  }
};
