import { Request, Response } from "express";
import { readAllMembers } from "../../api/manajemen-piket/member";

export const renderDashboardAdmin = (req: Request, res: Response) => {
  res.render("dashboard-admin/main");
};

export const renderManajemenOrang = async (req: Request, res: Response) => {
  // const orang = [{ nama: "sian" }, { nama: "arbi" }];
  const orang = await readAllMembers();
  res.render("dashboard-admin/manajemen-orang", {
    title: "Manajemen Orang",
    orang,
  });
};
