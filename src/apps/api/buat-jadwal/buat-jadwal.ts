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

const getDefaultPlace = (
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

const createRiwayatMap = (
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

const getAvailablePlace = (
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

const createScheduleEntry = (
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
