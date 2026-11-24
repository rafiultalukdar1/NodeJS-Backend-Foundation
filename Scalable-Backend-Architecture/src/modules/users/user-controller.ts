import { Request, Response } from "express";
import { userService } from './user-service';


// Create Users
const createUseer = async (req : Request, res : Response) => {
  try {
    const result = await userService.createUserIntoDB(req.body);

    res.status(201).json({
      success : true,
      message : "User created",
      data : result.rows[0],
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
}


// Getting All Users
const getAllUsers = async (req : Request, res : Response) => {
  try {
    const result = await userService.getAllUsersFromDB();

    res.status(200).json({
      success : true,
      message : "User retrived successfully",
      data : result.rows,
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
}


// Single user with params
const getSingleUser = async (req : Request, res : Response) => {
  try {
    const {id} = req.params;

    const result = await userService.getSingleUserDB(id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success : false,
        message : "User not found",
      });
    }
    
    res.status(200).json({
      success : true,
      message : "User retrived successfully",
      data : result.rows[0],
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
}


// Update User
const updateUser = async (req : Request, res : Response) => {
  try {
    const {id} = req.params;

    const result = await userService.updateUserBD(req.body, id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success : false,
        message : "User not found",
      });
    }

    res.status(200).json({
      success : true,
      message : "User updated successfully",
      data : result.rows[0],
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
}


// Delete User
const deleteUser = async (req : Request, res : Response) => {
  try {
    const {id} = req.params;

    const result = await userService.deleteUserDB(id as string);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success : false,
        message : "User not found",
      });
    }

    res.status(200).json({
      success : true,
      message : "User deleted successfully",
    });

  } catch (error : any) {
    res.status(500).json({
      success : false,
      message : error?.message,
      error : error,
    });
  }
}


export const userController = {
  createUseer,
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
}