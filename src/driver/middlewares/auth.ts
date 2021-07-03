import Express, { NextFunction } from "express";

export async function applyAdminClaims(req: Express.Request) {
    //@ts-ignore
    req.session.claims = { isAdmin: true };
}

export async function rejectNotAdmin(req: Express.Request, res: Express.Response, next: NextFunction): Promise<any> {


    if (isAdmin(req) !== true)
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });

    next();
}

export function isAdmin(req: Express.Request): boolean {
    //@ts-ignore
    return req.session?.claims?.isAdmin === true;
}