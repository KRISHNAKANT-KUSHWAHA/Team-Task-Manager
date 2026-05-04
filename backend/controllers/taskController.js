import mongoose from "mongoose";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const statuses = ["To Do", "In Progress", "Done"];
const priorities = ["Low", "Medium", "High"];

const canAccessProject = (project, user) => {
  return project.members.some((member) => member.toString() === user._id.toString());
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, priority, status = "To Do", assignedTo, projectId } = req.body;

    if (!title || !description || !dueDate || !assignedTo || !projectId) {
      res.status(400);
      throw new Error("Title, description, due date, assigned user, and project are required");
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo) || !mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400);
      throw new Error("Valid assigned user and project IDs are required");
    }

    if (priority && !priorities.includes(priority)) {
      res.status(400);
      throw new Error("Priority must be Low, Medium, or High");
    }

    if (!statuses.includes(status)) {
      res.status(400);
      throw new Error("Status must be To Do, In Progress, or Done");
    }

    const project = await Project.findById(projectId);
    const assignedUser = await User.findById(assignedTo);

    if (!project || !assignedUser) {
      res.status(404);
      throw new Error("Project or assigned user not found");
    }

    if (!canAccessProject(project, req.user) || !canAccessProject(project, assignedUser)) {
      res.status(403);
      throw new Error("Task can only be created inside projects shared by the admin and assignee");
    }

    const task = await Task.create({
      title,
      description,
      dueDate,
      priority: priority || "Medium",
      status,
      assignedTo,
      projectId
    });

    const populatedTask = await task.populate([
      { path: "assignedTo", select: "name email role" },
      { path: "projectId", select: "title" }
    ]);

    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req, res, next) => {
  try {
    const { projectId, status } = req.query;
    const query = {};

    if (projectId) {
      query.projectId = projectId;
    }

    if (status) {
      query.status = status;
    }

    if (req.user.role === "Member") {
      query.assignedTo = req.user._id;
    } else {
      const projects = await Project.find({ members: req.user._id }).select("_id");
      query.projectId = { $in: projects.map((project) => project._id) };
      if (projectId) {
        query.projectId = projectId;
      }
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email role")
      .populate("projectId", "title")
      .sort({ dueDate: 1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    const allowedUpdates = ["status"];
    const adminUpdates = ["title", "description", "dueDate", "priority", "status", "assignedTo", "projectId"];
    const incomingKeys = Object.keys(req.body);

    if (req.user.role === "Member") {
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Members can only update tasks assigned to them");
      }

      if (incomingKeys.some((key) => !allowedUpdates.includes(key))) {
        res.status(403);
        throw new Error("Members can update task status only");
      }
    }

    if (req.user.role === "Admin" && incomingKeys.some((key) => !adminUpdates.includes(key))) {
      res.status(400);
      throw new Error("One or more task fields are not editable");
    }

    if (req.body.status && !statuses.includes(req.body.status)) {
      res.status(400);
      throw new Error("Status must be To Do, In Progress, or Done");
    }

    if (req.body.priority && !priorities.includes(req.body.priority)) {
      res.status(400);
      throw new Error("Priority must be Low, Medium, or High");
    }

    Object.assign(task, req.body);
    await task.save();

    const populatedTask = await task.populate([
      { path: "assignedTo", select: "name email role" },
      { path: "projectId", select: "title" }
    ]);

    res.json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error("Task not found");
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
