import express from "express";
import User from "../../models/User.js";

export async function adminFetchUsers() {
  return await User.findAll();
}

export async function adminFetchUsersById(id) {
  return await User.findByPk(id);
}
