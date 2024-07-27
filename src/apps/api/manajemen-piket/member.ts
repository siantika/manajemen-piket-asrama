import Member from "../../../models/member";
import { logger } from "../../../utils/logger";

export const addMember = async (name: string) => {
  try {
    const newMember = await Member.create({
      memberName: name,
    });
    return newMember;
  } catch (error) {
    logger.error("Error adding member: ", error);
    throw new Error("Failed to add member");
  }
};

export const readAllMembers = async () => {
    try {
      const members = await Member.findAll();
      return members;
    } catch (error) {
      logger.error("Error read all members: ", error);
      throw new Error("Failed to read all members");
    }
  };

export const updateMember = async (id: string, name: string) => {
  try {
    const member = await Member.findByPk(id);
    if (!member) {
      throw new Error("Member not found");
    }
    member.memberName = name;
    await member.save();
    return member;
  } catch (error) {
    logger.error("Error updating member: ", error);
    throw new Error("Failed to update member");
  }
};

export const deleteMember = async (id: string) => {
  try {
    const member = await Member.findByPk(id);
    if (!member) {
      throw new Error("Member not found");
    }
    await member.destroy();
    return member;
  } catch (error) {
    logger.error("Error deleting member: ", error);
    throw new Error("Failed to delete member");
  }
};
