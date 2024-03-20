//create nextjs api routes for deposit with prisma
import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { amount, username } = req.body;
    console.log("amount on server", amount);

    const result = await prisma.tbl_deposit.create({
      data: {
        amount: amount,
        username,
        claim: 1,
      },
    });
    res.status(200).json({
      id: result.id.toString(),
      amount: result.amount,
      username: result.username,
      claim: result.claim,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
