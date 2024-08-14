import { Request, Response } from "express";
import { readAllMembers } from "../../api/manajemen-piket/member";
import { readAllPlaces } from "../../api/manajemen-piket/tempat";
import path from "path";
import { getAllPikets, updatePiket } from "../../api/manajemen-jadwal-piket-sekarang/piket-sekarang";
import { getAvailablePlace } from "../../api/buat-jadwal/helpers";

export const renderDashboardAdmin = (req: Request, res: Response) => {
  res.render("dashboard-admin/main", { currentPage: "main" });
};

export const renderManajemenOrang = async (req: Request, res: Response) => {
  const orang = await readAllMembers();
  res.render("dashboard-admin/manajemen-orang", {
    title: "Manajemen Orang",
    orang,
    currentPage: "orang",
  });
};

export const renderManajemenTempat = async (req: Request, res: Response) => {
  const tempat = await readAllPlaces();
  res.render("dashboard-admin/manajemen-tempat", {
    title: "Manajemen Tempat",
    tempat,
    currentPage: "tempat",
  });
};

export const renderManajemenPiketSekarang = async (
  req: Request,
  res: Response
) => {
  const piket = await getAllPikets();
  const tempatPiket = await readAllPlaces();
  res.render("dashboard-admin/manajemen-piket-sekarang", {
    piket,
    tempatPiket,
    title: "Manajemen Piket",
    currentPage: "piket",
  });
};
