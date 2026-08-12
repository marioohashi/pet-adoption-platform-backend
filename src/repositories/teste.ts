import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function test() {
  console.log(await prisma.animal.findMany());
}

test();