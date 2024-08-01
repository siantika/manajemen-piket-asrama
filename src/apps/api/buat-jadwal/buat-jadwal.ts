import { logger } from "../../../utils/logger";
import {
  createRiwayatMap,
  createScheduleEntry,
  getAvailablePlace,
  getDefaultPlace,
  getMembers,
  getRiwayatPiket,
  getTempat,
  saveGeneratedSchedule,
} from "./helpers";
import { IGeneratedSchedule, ISchedule } from "./interfaces";

export const generateSchedule = async (): Promise<IGeneratedSchedule[]> => {
  try {
    const members = await getMembers();
    const tempat = await getTempat();
    const riwayat = await getRiwayatPiket();

    const { defaultPlace, defaultPlaceId } = getDefaultPlace(tempat);

    // Map to store the history of places assigned to each member
    const riwayatMap = createRiwayatMap(riwayat);

    const schedule: IGeneratedSchedule[] = [];
    const usedPlacesToday = new Set<string>(); // To track places used today

    // Loop through each member and generate schedule
    for (const member of members) {
      const availablePlace = getAvailablePlace(
        member.memberId,
        tempat,
        usedPlacesToday,
        riwayatMap
      );

      if (availablePlace) {
        schedule.push(
          createScheduleEntry(
            member,
            availablePlace.tempatId,
            availablePlace.namaTempat
          )
        );
      } else {
        // Assign default place if no available place found
        schedule.push(
          createScheduleEntry(member, defaultPlaceId, defaultPlace)
        );
      }
    }

    // DEBUG
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
    const generatedScheduleData: IGeneratedSchedule[] =
      await generateSchedule();

    for (const schedule of generatedScheduleData) {
      const payload: ISchedule = {
        placeId: schedule.placeId,
        memberId: schedule.memberId,
        statusPiket: schedule.statusPiket as "belum" | "sudah", // Casting to match ISchedule
        tanggalPiket: schedule.tanggalPiket,
      };
      await saveGeneratedSchedule(payload);
    }
  } catch (error) {
    console.error("Error executing generateSchedule:", error);
  }
})();
