import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import CONST from "../config/consts";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "JWT secret is not configured",
    });
  }

  const headerAuth = req.headers["authorization"];
  const cookieToken = req.cookies?.authToken;
  let bearerToken = cookieToken;

  if (headerAuth) {
    const tokenParts = headerAuth.split(" ");

    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
      return res.status(StatusCodes.UNAUTHORIZED).send("Token format is wrong");
    }

    bearerToken = tokenParts[1];
  }

  if (!bearerToken) {
    return res.status(StatusCodes.UNAUTHORIZED).send("Unauthorized");
  }

  jwt.verify(
    bearerToken,
    jwtSecret,
    (err: VerifyErrors | null, decodedToken: string | JwtPayload | undefined) => {
      if (err) {
        return res.status(StatusCodes.UNAUTHORIZED).send("Token not valid!");
      }

      const role = (decodedToken as any).role;

      if (role !== CONST.ROLE.ADMIN) {
        return res.status(StatusCodes.FORBIDDEN).json({
          message: "Forbidden Request",
        });
      }
      req.body.user = role;
      next();
    }
  );
};
