const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

const AUCTION_FORMATS = ['ONLINE', 'IN_PERSON'] as const;

function generateFakeCounty() {
  const state = faker.location.state({ abbreviated: true });
  return {
    countyName: faker.location.county(),
    state,
    urlMain: faker.internet.url(),
    urlTaxOffice: faker.internet.url(),
    urlTaxOther: faker.datatype.boolean() ? faker.internet.url() : null,
    phone: faker.phone.number(),
    email: faker.internet.email(),
    nextAuctionDate: faker.date.future(),
    auctionFormat: faker.helpers.arrayElement(AUCTION_FORMATS),
    notes: faker.lorem.sentences(2),
  };
}

async function main() {
  const counties = Array.from({ length: 500 }, generateFakeCounty);

  // Use batching if needed (Prisma limit is 10k per call, we're well under that)
  await prisma.countyAuction.createMany({
    data: counties,
    skipDuplicates: true,
  });

  console.log('✅ Seeded 500 fake county auctions');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });