import { Request, Response } from "express";

export const renderDashboardAdmin = (req: Request, res: Response) => {
  res.render("dashboard-admin/main");
};
