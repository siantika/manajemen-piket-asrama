import RiwayatPiket from "../../../models/riwayat-piket";
import { logger } from "../../../utils/logger";
import {
  createRiwayatMap,
  createScheduleEntry,
  getAvailablePlace,
  getDefaultPlace,
  getMembers,
  getRiwayatPiket,
  getTempat,
} from "./helpers";
import { IGeneratedSchedule, ISchedule } from "./interfaces";

export const generateSchedule = async (): Promise<IGeneratedSchedule[]> => {
  try {
    const members = await getMembers();
    const tempat = await getTempat();
    const riwayat = await getRiwayatPiket();

    // Setup default place
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

export const sendToDatabase = async (data: ISchedule) => {
  try {
    await RiwayatPiket.create({
      tempatId: data.tempatId,
      penghuniId: data.penghuniId,
      statusPiket: data.statusPiket,
      tanggalPiket: data.tanggalPiket,
    });
  } catch (error) {
    logger.error(error);
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
        tempatId: schedule.placeId,
        penghuniId: schedule.memberId,
        statusPiket: schedule.statusPiket as "belum" | "sudah", // Casting to match ISchedule
        tanggalPiket: schedule.tanggalPiket,
      };
      await sendToDatabase(payload);
    }
  } catch (error) {
    console.error("Error executing generateSchedule:", error);
  }
})();
