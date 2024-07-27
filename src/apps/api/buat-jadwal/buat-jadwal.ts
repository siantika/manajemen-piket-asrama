import { any } from "joi";
import Member from "../../../models/member";
import RiwayatPiket, { IRiwayatPiket } from "../../../models/riwayat-piket";
import Tempat from "../../../models/tempat";
import { logger } from "../../../utils/logger";

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

export const generateSchedule = async () => {
  try {
    const members = await getMembers();
    const tempat = await getTempat();
    const riwayat = await getRiwayatPiket();

    // Ambil nama tempat cadangan dari array tempat
    const defaultPlaceObject = tempat.find((t) => t.namaTempat === "Tamu");
    const defaultPlace = defaultPlaceObject
      ? defaultPlaceObject.namaTempat
      : "Tanya Admin";

    const riwayatMap = ({} = riwayat.reduce((map: any, entry: any) => {
      if (!map[entry.penghuniId]) {
        map[entry.penghuniId] = new Set();
      }
      map[entry.penghuniId].add(entry.tempatId);
      return map;
    }, {} as { [key: number]: Set<number> }));

    // DEBUG
    console.log("Ini riwayat map: ", riwayatMap);
    // Tampilkan hasil di console
    console.log("Riwayat Map:");
    Object.keys(riwayatMap).forEach((penghuniId) => {
      const tempatIds = Array.from(riwayatMap[+penghuniId]);
      console.log(
        `Penghuni ID: ${penghuniId}, Tempat IDs: ${tempatIds.join(", ")}`
      );
    });

    const schedule = [];

    const usedPlaces = new Set<string>(); // Menyimpan tempat yang sudah digunakan

    // Loop untuk setiap anggota
    for (const member of members) {
      let assigned = false; // Flag untuk menandai apakah anggota sudah mendapatkan tempat

      for (const place of tempat) {
        if (!usedPlaces.has(place.tempatId)) {
          // Tambahkan tempat ke jadwal untuk anggota
          schedule.push({ member: member.memberName, place: place.namaTempat });
          usedPlaces.add(place.tempatId); // Tandai tempat sebagai telah digunakan
          assigned = true; // Tandai bahwa anggota telah mendapatkan tempat
          break; // Pindah ke anggota berikutnya setelah menetapkan tempat
        }
      }

      // Jika tempat habis, tetapkan tempat "Taman" untuk anggota yang tersisa
      if (!assigned) {
        schedule.push({ member: member.memberName, place: defaultPlace });
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
