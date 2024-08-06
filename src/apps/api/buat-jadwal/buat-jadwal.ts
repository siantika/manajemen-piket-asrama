import { applyStyles } from "@popperjs/core";
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
  saveRecapPicket,
  shuffleArray,
} from "./helpers";
import { IGeneratedSchedule, IRekapPiket } from "./interfaces";

export const generateSchedule = async (): Promise<IGeneratedSchedule[]> => {
  try {
    const members = await getMembers();
    const tempat = await getTempat();
    const riwayat = await getRiwayatPiket();

    // Shuffle the place and member to ensures randomness
    const tempatAcak = shuffleArray(tempat);
    const memberAcak= shuffleArray(members);

    const { defaultPlace, defaultPlaceId } = getDefaultPlace(tempat);

    // Map to store the history of places assigned to each member
    const riwayatMap = createRiwayatMap(riwayat);

    const schedule: IGeneratedSchedule[] = [];
    const usedPlacesToday = new Set<string>(); // To track places used today

    // Loop through each member and generate schedule
    for (const member of memberAcak) {
      const availablePlace = getAvailablePlace(
        member.memberId,
        tempatAcak,
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

    logger.info("Generated Schedule:", schedule);
    return schedule;
  } catch (error) {
    logger.error("Error generating schedule:", error);
    throw error;
  }
};

// Properly call the functions
(async () => {
  try {
    const generatedScheduleData: IGeneratedSchedule[] =
      await generateSchedule();

    for (const schedule of generatedScheduleData) {
      const rekapPiket: IRekapPiket = {
        placeId: schedule.placeId,
        memberId: schedule.memberId,
        statusPiket: schedule.statusPiket as "belum" | "sudah", // Casting to match ISchedule
        tanggalPiket: schedule.tanggalPiket,
      };
      const piketSekarang: IGeneratedSchedule = {
        placeId: schedule.placeId,
        place: schedule.place,
        memberId: schedule.memberId,
        member: schedule.member,
        statusPiket: schedule.statusPiket as "belum" | "sudah", // Casting to match ISchedule
        tanggalPiket: schedule.tanggalPiket,
      };
      await saveRecapPicket(rekapPiket);
      await saveGeneratedSchedule(piketSekarang);
    }
  } catch (error) {
    logger.error("Error executing generateSchedule:", error);
  }
})();
