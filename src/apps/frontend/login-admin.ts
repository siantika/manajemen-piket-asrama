import { Request, Response } from "express";

export const renderLoginAdmin = (req: Request, res: Response) => {
  res.render("login-admin");
};
