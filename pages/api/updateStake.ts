import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Assuming you're sending the stake ID in the request body to identify the stake to update
    const { stakeId } = req.body;

    // Update the 'claim' field of the specified stake to 'true'
    const result = await prisma.tbl_Stake.update({
      where: {
        id: stakeId, // Replace with the actual identifier field of your stake
      },
      data: {
        claim: true,
      },
    });

    // Send the updated stake as a response
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
