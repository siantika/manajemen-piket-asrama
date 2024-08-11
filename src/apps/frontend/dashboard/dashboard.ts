import { Request, Response } from "express";
import { readAllMembers } from "../../api/manajemen-piket/member";
import { readAllPlaces } from "../../api/manajemen-piket/tempat";

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
