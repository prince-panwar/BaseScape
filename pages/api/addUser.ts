import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { username } = req.body;

    // Create a new user record in the database
    const newUser = await prisma.user.create({
      data: {
        username: username,
        // The stakes and deposits arrays will be empty by default
      },
      select: {
        id: true,
        username: true,
      }
    });

    // Convert BigInt id to string
    const userResponse = {
      ...newUser,
      id: newUser.id.toString(),
    };

    // Respond with the created user data
    res.status(200).json(userResponse);
  } catch (error:any) {
    console.error("Request error", error);
    res.status(500).json({ error: "Error creating user", message: error.message });
  }
}
