import mongoose from "mongoose";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Task from "../models/Task.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProject = async (req, res, next) => {
  try {
    const { title, description, members = [] } = req.body;

    if (!title || !description) {
      res.status(400);
      throw new Error("Project title and description are required");
    }

    const memberIds = [...new Set([req.user._id.toString(), ...members])];
    const users = await User.find({ _id: { $in: memberIds } });

    if (users.length !== memberIds.length) {
      res.status(400);
      throw new Error("One or more members were not found");
    }

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: memberIds
    });

    await User.updateMany(
      { _id: { $in: memberIds } },
      { $addToSet: { projects: project._id } }
    );

    const populatedProject = await project.populate("members", "name email role");
    res.status(201).json(populatedProject);
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req, res, next) => {
  try {
    const query =
      req.user.role === "Admin"
        ? { $or: [{ createdBy: req.user._id }, { members: req.user._id }] }
        : { members: req.user._id };

    const projects = await Project.find(query)
      .populate("createdBy", "name email role")
      .populate("members", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!isValidId(req.params.id) || !isValidId(userId)) {
      res.status(400);
      throw new Error("Valid project ID and user ID are required");
    }

    const project = await Project.findById(req.params.id);
    const user = await User.findById(userId);

    if (!project || !user) {
      res.status(404);
      throw new Error("Project or user not found");
    }

    project.members.addToSet(user._id);
    await project.save();
    await User.findByIdAndUpdate(user._id, { $addToSet: { projects: project._id } });

    const populatedProject = await project.populate("members", "name email role");
    res.json(populatedProject);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.body;

    if (!isValidId(req.params.id) || !isValidId(userId)) {
      res.status(400);
      throw new Error("Valid project ID and user ID are required");
    }

    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.createdBy.toString() === userId) {
      res.status(400);
      throw new Error("Project creator cannot be removed");
    }

    project.members.pull(userId);
    await project.save();
    await User.findByIdAndUpdate(userId, { $pull: { projects: project._id } });
    await Task.updateMany(
      { projectId: project._id, assignedTo: userId },
      { $set: { assignedTo: project.createdBy } }
    );

    const populatedProject = await project.populate("members", "name email role");
    res.json(populatedProject);
  } catch (error) {
    next(error);
  }
};
