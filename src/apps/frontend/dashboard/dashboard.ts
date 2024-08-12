import { Request, Response } from "express";
import { readAllMembers } from "../../api/manajemen-piket/member";
import { readAllPlaces } from "../../api/manajemen-piket/tempat";
import path from "path";

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
  const piket = [
    { id: "99yasdh2", tanggal_piket: new Date(), nama: "Sian" },
    { id: "99yasdh3", tanggal_piket: new Date(), nama: "Arbi" },
  ];
  console.log(
    "Rendering view from:",
    path.join(__dirname, "views/dashboard-admin/manajemen-piket-sekarang")
  );
  res.render("dashboard-admin/manajemen-piket-sekarang", {
    piket,
    title: "Manajemen Tempat",
    currentPage: "piket",
  });
};
