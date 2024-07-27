import Tempat from "../../../models/tempat";
import { logger } from "../../../utils/logger";

export const addPlace = async (name: string, statusTempat:string) => {
  try {
    const newMember = await Tempat.create({
      namaTempat: name,
      statusTempat
    });
    return newMember;
  } catch (error) {
    logger.error("Error adding place: ", error);
    throw new Error("Failed to add place");
  }
};

export const readAllPlaces = async () => {
  try {
    const members = await Tempat.findAll();
    return members;
  } catch (error) {
    logger.error("Error read all places: ", error);
    throw new Error("Failed to read all places");
  }
};

export const updatePlace = async (id: string, name: string, statusTempat: string) => {
  // cek 'status tempat' di database tempat
  try {
    const tempat = await Tempat.findByPk(id);
    if (!tempat) {
      throw new Error("Tempat not found");
    }

    tempat.namaTempat = name;
    tempat.statusTempat = statusTempat;
    await tempat.save();
    return tempat;
  } catch (error) {
    logger.error("Error updating Tempat: ", error);
    throw new Error("Failed to update Tempat");
  }
};

export const deletePlace = async (id: string) => {
  try {
    const tempat = await Tempat.findByPk(id);
    if (!tempat) {
      throw new Error("Tempat not found");
    }
    await tempat.destroy();
    return tempat;
  } catch (error) {
    logger.error("Error deleting Tempat: ", error);
    throw new Error("Failed to delete Tempat");
  }
};
