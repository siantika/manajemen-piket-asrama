import { Request, Response } from "express";
import {
  addMember,
  updateMember,
  deleteMember,
  readAllMembers,
} from "../manajemen_piket/manajemen-piket";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../utils/logger";

export const addMemberHandler = async (req: Request, res: Response) => {
  const { memberName } = req.body;

  try {
    const newMember = await addMember(memberName);
    res.status(StatusCodes.CREATED).json({
      message: "Member added successfully",
      data: newMember,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const readAllMemberHandler = async (req: Request, res: Response) => {
  try {
    const members = await readAllMembers();
    res.status(StatusCodes.OK).json({
      data: members,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const updateMemberHandler = async (req: Request, res: Response) => {
  const { memberId, memberName } = req.body;

  try {
    const updatedMember = await updateMember(memberId, memberName);
    res.status(StatusCodes.OK).json({
      message: "Member updated successfully",
      data: updatedMember,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deleteMemberHandler = async (req: Request, res: Response) => {
  const memberId = req.params.memberId;

  try {
    const deletedMember = await deleteMember(memberId);
    res.status(StatusCodes.OK).json({
      message: "Member deleted successfully",
      data: deletedMember,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
