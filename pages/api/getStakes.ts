//create nextjs api routes for deposit with prisma
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
    const { id } = req.body;
    const result = await prisma.tbl_Stake.findMany({
      where:{
        userId :{
          equals:id,
        },
      }
    }
    );
    res.status(200).send(json(result));
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
