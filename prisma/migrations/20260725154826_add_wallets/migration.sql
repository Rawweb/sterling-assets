-- CreateTable
CREATE TABLE "WalletAddress" (
    "id" TEXT NOT NULL,
    "coin" TEXT NOT NULL,
    "network" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "minCents" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WalletAddress_coin_key" ON "WalletAddress"("coin");
