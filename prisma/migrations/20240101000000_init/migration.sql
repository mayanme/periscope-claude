-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('PENDING', 'RESEARCHING', 'SYNTHESIZING', 'COMPLETE', 'FAILED');

-- CreateTable
CREATE TABLE "FirmSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT 'My Fund',
    "thesis" TEXT NOT NULL DEFAULT '',
    "stageFocus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sectorFocus" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FirmSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalDoc" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InternalDoc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocChunk" (
    "id" TEXT NOT NULL,
    "docId" TEXT NOT NULL,
    "chunkIdx" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "tsv" tsvector,

    CONSTRAINT "DocChunk_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deal" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT '',
    "companyUrl" TEXT,
    "pitchDeckPath" TEXT,
    "status" "DealStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "researchData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brief" (
    "id" TEXT NOT NULL,
    "dealId" TEXT NOT NULL,
    "companyOverview" JSONB NOT NULL,
    "founderAndTeam" JSONB NOT NULL,
    "marketLandscape" JSONB NOT NULL,
    "tractionFinancials" JSONB NOT NULL,
    "fundFit" JSONB NOT NULL,
    "sources" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Brief_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocChunk_docId_idx" ON "DocChunk"("docId");

-- CreateIndex
CREATE UNIQUE INDEX "Brief_dealId_key" ON "Brief"("dealId");

-- AddForeignKey
ALTER TABLE "DocChunk" ADD CONSTRAINT "DocChunk_docId_fkey" FOREIGN KEY ("docId") REFERENCES "InternalDoc"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Brief" ADD CONSTRAINT "Brief_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ── Full-text search: GIN index + auto-update trigger ─────────────────────
CREATE INDEX "doc_chunk_tsv_idx" ON "DocChunk" USING GIN (tsv);

CREATE OR REPLACE FUNCTION doc_chunk_tsv_update() RETURNS trigger AS $$
BEGIN
  NEW.tsv := to_tsvector('english', NEW.content);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER doc_chunk_tsv_trigger
BEFORE INSERT OR UPDATE ON "DocChunk"
FOR EACH ROW EXECUTE FUNCTION doc_chunk_tsv_update();
