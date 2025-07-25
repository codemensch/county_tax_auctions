-- CreateEnum
CREATE TYPE "AuctionFormat" AS ENUM ('ONLINE', 'IN_PERSON');

-- CreateTable
CREATE TABLE "CountyAuction" (
    "id" TEXT NOT NULL,
    "countyName" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "urlMain" TEXT NOT NULL,
    "urlTaxOffice" TEXT NOT NULL,
    "urlTaxOther" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "nextAuctionDate" TIMESTAMP(3),
    "auctionFormat" "AuctionFormat" NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CountyAuction_pkey" PRIMARY KEY ("id")
);
