import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const headerAuth = req.headers["authorization"];

  if (!headerAuth) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
  }

  const tokenParts = headerAuth.split(" ");

  if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
    return res.status(StatusCodes.UNAUTHORIZED).send("Token format is wrong");
  }

  const bearerToken = tokenParts[1];

  jwt.verify(
    bearerToken,
    process.env.JWT_SECRET as string,
    (err, decodedToken) => {
      if (err) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Token not valid!");
      }

      const role = (decodedToken as any).role;

      if (role !== "admin") {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Forbidden Request",
        });
      }
      req.body.user = role;
      next();
    }
  );
};
