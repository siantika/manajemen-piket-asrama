import { Request, Response } from "express";
import {
  addMember,
  updateMember,
  deleteMember,
  readAllMembers,
} from "./member";
import { StatusCodes } from "http-status-codes";
import { logger } from "../../../utils/logger";
import { addPlace, deletePlace, readAllPlaces, updatePlace } from "./tempat";

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

// tempat
export const addPlaceHandler = async (req: Request, res: Response) => {
  const { placeName } = req.body;

  try {
    const newPlace = await addPlace(placeName);
    res.status(StatusCodes.CREATED).json({
      message: "Place added successfully",
      data: newPlace,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const readAllPlacesHandler = async (req:Request, res: Response) => {
  try {
    const places = await readAllPlaces();
    res.status(StatusCodes.OK).json({
      data: places,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const updatePlaceHandler = async (req: Request, res: Response) => {
  const { placeId, placeName } = req.body;

  try {
    const updatedPlace = await updatePlace(placeId, placeName);
    res.status(StatusCodes.OK).json({
      message: "Place updated successfully",
      data: updatedPlace,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};

export const deletePlaceHandler = async (req: Request, res: Response) => {
  const placeId = req.params.placeId;

  try {
    const deletedMember = await deletePlace(placeId);
    res.status(StatusCodes.OK).json({
      message: "Place deleted successfully",
      data: deletedMember,
    });
  } catch (error: any) {
    logger.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message,
    });
  }
};
