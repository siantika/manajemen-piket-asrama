import { Request, Response } from "express";

export const renderDashboardAdmin = (req: Request, res: Response) => {
  res.render("dashboard-admin/main");
};

export const renderManajemenOrang = (req: Request, res: Response) => {
  const orang = [{ nama: "sian" }, { nama: "arbi" }];
  res.render("dashboard-admin/manajemen-orang", {
    title: "Manajemen Orang",
    orang,
  });
};
