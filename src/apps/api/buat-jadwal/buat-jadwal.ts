import { any } from "joi";
import Member from "../../../models/member";
import RiwayatPiket, { IRiwayatPiket } from "../../../models/riwayat-piket";
import Tempat from "../../../models/tempat";
import { logger } from "../../../utils/logger";

const getMembers = async (): Promise<Member[]> => {
  try {
    return await Member.findAll() as Member[];
  } catch (error) {
    logger.error("Error fetching members:", error);
    throw error;
  }
};

const getTempat = async (): Promise<Tempat[]> => {
  try {
    return await Tempat.findAll() as Tempat[];
  } catch (error) {
    logger.error("Error fetching tempat:", error);
    throw error;
  }
};

const getRiwayatPiket = async (): Promise<IRiwayatPiket[]> => {
  try {
    return await RiwayatPiket.findAll() as IRiwayatPiket[];
  } catch (error) {
    logger.error("Error fetching riwayat piket:", error);
    throw error;
  }
};

export const generateSchedule = async () => {
  try {
    const members = await getMembers();
    const tempat:any = await getTempat();
    const riwayat:any = await getRiwayatPiket();

    const riwayatMap: { [key: number]: Set<number> } | any ={} = riwayat.reduce((map:any, entry:any) => {
      if (!map[entry.penghuniId]) {
        map[entry.penghuniId] = new Set();
      }
      map[entry.penghuniId].add(entry.tempatId);
      return map;
    }, {} as { [key: number]: Set<number> });

    const schedule = [];

    for (const member of members) {
      for (const place of tempat) {
        const memberHistory = riwayatMap[member.memberId] || new Set();
        if (!memberHistory.has(place.tempatId)) {
          schedule.push({ member: member.memberName, place: place.placeName });
          break; // Move to the next member after assigning a place
        }
      }
    }

    console.log("Generated Schedule:", schedule);
    return schedule;
  } catch (error) {
    logger.error("Error generating schedule:", error);
    throw error;
  }
};

// Properly call the generateSchedule function
(async () => {
  try {
    await generateSchedule();
  } catch (error) {
    console.error("Error executing generateSchedule:", error);
  }
})();
