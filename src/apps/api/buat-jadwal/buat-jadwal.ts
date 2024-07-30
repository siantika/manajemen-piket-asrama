import Member from "../../../models/member";
import RiwayatPiket, { IRiwayatPiket } from "../../../models/riwayat-piket";
import Tempat from "../../../models/tempat";
import { logger } from "../../../utils/logger";
import CONST from "../../../config/consts";

// Interface
interface ISchedule {
  tempatId: string;
  penghuniId: string;
  statusPiket: "belum" | "sudah";
  tanggalPiket: Date;
}

interface IGeneratedSchedule {
  memberId: string;
  member: string;
  placeId: string;
  place: string;
  statusPiket: string;
  tanggalPiket: Date;
}

const getMembers = async (): Promise<Member[]> => {
  try {
    return (await Member.findAll()) as Member[];
  } catch (error) {
    logger.error("Error fetching members:", error);
    throw error;
  }
};

const getTempat = async (): Promise<Tempat[]> => {
  try {
    return (await Tempat.findAll()) as Tempat[];
  } catch (error) {
    logger.error("Error fetching tempat:", error);
    throw error;
  }
};

const getRiwayatPiket = async (): Promise<IRiwayatPiket[]> => {
  try {
    return (await RiwayatPiket.findAll()) as IRiwayatPiket[];
  } catch (error) {
    logger.error("Error fetching riwayat piket:", error);
    throw error;
  }
};

export const generateSchedule = async (): Promise<IGeneratedSchedule[]> => {
  try {
    const members = await getMembers();
    const tempat = await getTempat();
    const riwayat = await getRiwayatPiket();

    const defaultPlaceObject = tempat.find(
      (t) => t.statusTempat === CONST.STATUS_TEMPAT.RESERVED
    );
    const defaultPlace = defaultPlaceObject
      ? defaultPlaceObject.namaTempat
      : "Tanya Admin";
    const defaultPlaceId = defaultPlaceObject
      ? defaultPlaceObject.tempatId
      : "Undefined";

    // Map to store the history of places assigned to each member
    const riwayatMap = riwayat.reduce((map, entry) => {
      if (!map[entry.penghuniId]) {
        map[entry.penghuniId] = new Set();
      }
      map[entry.penghuniId].add(entry.tempatId);
      return map;
    }, {} as { [key: string]: Set<string> });

    const schedule: IGeneratedSchedule[] = [];
    const usedPlacesToday = new Set<string>(); // To track places used today

    // Function to get a place for a member avoiding previously assigned places
    const getAvailablePlace = (memberId: string) => {
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

    // Loop through each member
    for (const member of members) {
      const availablePlace = getAvailablePlace(member.memberId);

      if (availablePlace) {
        schedule.push({
          memberId: member.memberId,
          member: member.memberName,
          placeId: availablePlace.tempatId,
          place: availablePlace.namaTempat,
          statusPiket: CONST.STATUS_PIKET.BELUM,
          tanggalPiket: new Date(),
        });
      } else {
        // Assign default place if no available place found
        schedule.push({
          memberId: member.memberId,
          member: member.memberName,
          placeId: defaultPlaceId,
          place: defaultPlace,
          statusPiket: CONST.STATUS_PIKET.BELUM,
          tanggalPiket: new Date(),
        });
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
