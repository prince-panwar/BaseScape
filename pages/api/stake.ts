import prisma from "../../utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { amount,  address,id , start,duration,end } = req.body;
    console.log("depsoit amount on server", amount);

    // Find the user by ID and update their deposit amount
    const result = await prisma.tbl_Stake.create({
      
      data: {
        amount: amount,
        address:address,
        claim: false,
        userId:id,
        startDate:start,
        duration:duration,
        endDate:end
        // You can add other fields to update here
      },
    });

    res.status(200).json({
      id: result.id.toString(),
      amount: result.amount,
      // Include any other fields that you updated
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
