import Member from "../../../models/member";
import RiwayatPiket from "../../../models/riwayat-piiket";
import Tempat from "../../../models/tempat";
import { logger } from "../../../utils/logger";

const getMembers = async () => {
  try {
    return await Member.findAll();
  } catch (error) {
    logger.error("Error fetching members:", error);
    throw error;
  }
};

const getTempat = async () => {
  try {
    return await Tempat.findAll();
  } catch (error) {
    logger.error("Error fetching tempat:", error);
    throw error;
  }
};

const getRiwayatPiket = async () => {
  try {
    return await RiwayatPiket.findAll();
  } catch (error) {
    logger.error("Error fetching riwayat piket:", error);
    throw error;
  }
};

(async () => {
  try {
    const members = await getMembers();
    const tempat = await getTempat();
    const riwayat = await getRiwayatPiket();

    console.log(`
      *) Member Asrama: ${JSON.stringify(members, null, 2)} \n
      *) Tempat Piket : ${JSON.stringify(tempat, null, 2)} \n
      *) Riwayat Piket: ${JSON.stringify(riwayat, null, 2)} \n
    `);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
})();
