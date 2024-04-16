import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const json = (param: any): any => {
    return JSON.stringify(
      param,
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    );
  };

export default async function handle(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { username } = req.query;
        // Check if username is an array and handle accordingly
        const usernameString = Array.isArray(username) ? username[0] : username;

        // Check if username is undefined or null
        if (!usernameString) {
            return res.status(400).json({ error: "Username is required" });
        }
        console.log(usernameString);
        const result = await prisma.user.findMany({
            where: {
                username: {
                    equals: usernameString,
                },
            },
        });
        res.status(200).send(json(result));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}