import Member from "../../../models/member";
import RiwayatPiket, { IRiwayatPiket } from "../../../models/riwayat-piket";
import Tempat from "../../../models/tempat";
import { logger } from "../../../utils/logger";
import CONST from "../../../config/consts";
import { IGeneratedSchedule } from "./interfaces";

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
