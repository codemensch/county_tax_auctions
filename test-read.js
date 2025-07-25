const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const counties = await prisma.countyAuction.findMany();
  console.log(counties);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  prisma.$disconnect();
});