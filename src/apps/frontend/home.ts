import { Request, Response } from "express";

export interface Piket {
  nama: string;
  tempat: string;
}

export interface LihatDaftarPiket {
  piketData: Piket[];
  tanggalPiket: string;
}

const piketData = [
  { nama: "Sian", tempat: "Dapur" },
  { nama: "Arbi", tempat: "Kamar Mandi" },
  { nama: "Yoga", tempat: "Tamu" },
  { nama: "Agus", tempat: "Dapur" },
];

const tanggalPiket = "Minggu, 17 Juli 2024";

export const renderHomePage = (req: Request, res: Response) => {
  const data: LihatDaftarPiket = { piketData, tanggalPiket };
  res.render("home", data);
};
