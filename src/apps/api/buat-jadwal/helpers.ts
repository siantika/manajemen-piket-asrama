import Member from "../../../models/member";
import RiwayatPiket, { IRiwayatPiket } from "../../../models/riwayat-piket";
import Tempat from "../../../models/tempat";
import { logger } from "../../../utils/logger";
import CONST from "../../../config/consts";
import { IGeneratedSchedule, IRekapPiket } from "./interfaces";
import Joi from "joi";
import PiketSekarang from "../../../models/piket-sekarang";

export const getMembers = async (): Promise<Member[]> => {
  try {
    return (await Member.findAll()) as Member[];
  } catch (error) {
    logger.error("Error fetching members:", error);
    throw error;
  }
};

export const getTempat = async (): Promise<Tempat[]> => {
  try {
    return (await Tempat.findAll()) as Tempat[];
  } catch (error) {
    logger.error("Error fetching tempat:", error);
    throw error;
  }
};

export const getRiwayatPiket = async (): Promise<IRiwayatPiket[]> => {
  try {
    return (await RiwayatPiket.findAll()) as IRiwayatPiket[];
  } catch (error) {
    logger.error("Error fetching riwayat piket:", error);
    throw error;
  }
};

export const getDefaultPlace = (
  tempat: Tempat[]
): { defaultPlace: string; defaultPlaceId: string } => {
  const defaultPlaceObject = tempat.find(
    (t) => t.statusTempat === CONST.STATUS_TEMPAT.RESERVED
  );
  return {
    defaultPlace: defaultPlaceObject
      ? defaultPlaceObject.namaTempat
      : "Tanya Admin",
    defaultPlaceId: defaultPlaceObject
      ? defaultPlaceObject.tempatId
      : "Undefined",
  };
};

export const createRiwayatMap = (
  riwayat: IRiwayatPiket[]
): { [key: string]: Set<string> } => {
  return riwayat.reduce((map, entry) => {
    if (!map[entry.penghuniId]) {
      map[entry.penghuniId] = new Set();
    }
    map[entry.penghuniId].add(entry.tempatId);
    return map;
  }, {} as { [key: string]: Set<string> });
};

export const getAvailablePlace = (
  memberId: string,
  tempat: Tempat[],
  usedPlacesToday: Set<string>,
  riwayatMap: { [key: string]: Set<string> }
): Tempat | null => {
  for (const place of tempat) {
    if (
      !usedPlacesToday.has(place.tempatId) &&
      (!riwayatMap[memberId] || !riwayatMap[memberId].has(place.tempatId))
    ) {
      usedPlacesToday.add(place.tempatId);
      return place;
    }
  }
  return null;
};

export const createScheduleEntry = (
  member: Member,
  placeId: string,
  place: string
): IGeneratedSchedule => {
  return {
    memberId: member.memberId,
    member: member.memberName,
    placeId,
    place,
    statusPiket: CONST.STATUS_PIKET.BELUM,
    tanggalPiket: new Date(),
  };
};

export const isImportantPlaceFulfilled = (
  placesInSchedule: Array<string>,
  importantPlaces: Array<string>
): boolean => {
  const placesInScheduleSet = new Set(placesInSchedule);
  console.log(` Places in schedule: ${[... placesInScheduleSet]}`);
  console.log(`Important places: ${importantPlaces}`);
  return importantPlaces.every((place) => placesInScheduleSet.has(place));
};

export const getImportantPlaces = async (): Promise<string[]> => {
  try {
    const importantPlaces = await Tempat.findAll({
      where: {
        statusTempat: 'non reserve',
      },
      attributes: ['namaTempat'],
    });

    return importantPlaces.map((tempat: { namaTempat: string }) => tempat.namaTempat);
  } catch (error) {
    logger.error('Error fetching important places:', error);
    return [];
  }
};

export const getPlacesFromSchedule = (
  schedule: IGeneratedSchedule[]
): string[] => {
  return schedule.map((eachSchedule) => eachSchedule.place);
};

export const deleteAllRiwayatPiket = async (): Promise<void> => {
  try {
    await RiwayatPiket.destroy({
      where: {},
      truncate: true,
    });

    logger.info("All riwayatPiket records have been deleted.");
  } catch (error) {
    logger.error("Error deleting all riwayatPiket records:", error);
    throw new Error("Failed to delete all riwayatPiket records");
  }
};

export const saveGeneratedSchedule = async (schedule: IGeneratedSchedule) => {
  try {
    const { error } = generatedScheduleSchema.validate({
      placeId: schedule.placeId,
      place: schedule.place,
      memberId: schedule.memberId,
      member: schedule.member,
      statusPiket: schedule.statusPiket,
      tanggalPiket: schedule.tanggalPiket,
    });
    if (error) {
      logger.error("Validation error:", error.details);
      throw new Error(
        `Validation error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }

    const statusPiketReceived = schedule.statusPiket;
    // Make sure statusPiket value is "belum" or "sudah"
    if (!(statusPiketReceived === "sudah" || statusPiketReceived === "belum")) {
      throw new Error("Invalid statusPiket value");
    }

    await PiketSekarang.create({
      tanggalPiket: schedule.tanggalPiket,
      nama: schedule.member,
      tempat: schedule.place,
      statusPiket: statusPiketReceived,
    });
  } catch (error) {
    logger.error(error);
  }
};

export const saveRecapPicket = async (schedules: IRekapPiket) => {
  try {
    const { error } = scheduleSchema.validate({
      placeId: schedules.placeId,
      memberId: schedules.memberId,
      statusPiket: schedules.statusPiket,
      tanggalPiket: schedules.tanggalPiket,
    });

    if (error) {
      logger.error("Validation error:", error.details);
      throw new Error(
        `Validation error: ${error.details.map((d) => d.message).join(", ")}`
      );
    }
    const statusPiketReceived = schedules.statusPiket;
    // Make sure statusPiket value is "belum" or "sudah"
    if (!(statusPiketReceived === "sudah" || statusPiketReceived === "belum")) {
      throw new Error("Invalid statusPiket value");
    }

    await RiwayatPiket.create({
      tempatId: schedules.placeId,
      penghuniId: schedules.memberId,
      statusPiket: statusPiketReceived,
      tanggalPiket: schedules.tanggalPiket,
    });
  } catch (error) {
    logger.error(error);
    throw error;
  }
};

export const shuffleArray = (array: any) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const scheduleSchema = Joi.object({
  placeId: Joi.string().required(),
  memberId: Joi.string().required(),
  statusPiket: Joi.string().valid("sudah", "belum").required(),
  tanggalPiket: Joi.date().required(),
});

const generatedScheduleSchema = Joi.object({
  placeId: Joi.string().required(),
  place: Joi.string().required(),
  memberId: Joi.string().required(),
  member: Joi.string().required(),
  statusPiket: Joi.string().valid("sudah", "belum").required(),
  tanggalPiket: Joi.date().required(),
});
