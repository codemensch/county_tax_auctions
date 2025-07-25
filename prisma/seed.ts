const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.countyAuction.create({
    data: {
      countyName: "Los Angeles County",
      state: "California",
      urlMain: "https://lacounty.gov",
      urlTaxOffice: "https://ttc.lacounty.gov",
      auctionFormat: "ONLINE",
    },
  });

  console.log("✅ Seed completed!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });