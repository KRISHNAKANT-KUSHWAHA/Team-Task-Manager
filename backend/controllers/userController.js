import User from "../models/User.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("name email role projects").sort({ name: 1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};
