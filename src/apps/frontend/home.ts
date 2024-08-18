// dummy aja, belum real
import { Request, Response } from "express";
import { getAllPikets } from "../api/manajemen-jadwal-piket-sekarang/piket-sekarang";



const piketData = async () => {
  return await getAllPikets();
};

export const renderHomePage = async (req: Request, res: Response) => {
  try {
    const data = await piketData(); 
    res.render("home", {
      piketData: data, 
    });
  } catch (error) {
    console.error('Error fetching piket data:', error);
    res.status(500).send('Internal Server Error');
  }
};
