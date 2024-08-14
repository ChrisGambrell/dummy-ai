-- DropForeignKey
ALTER TABLE "Field" DROP CONSTRAINT "Field_schemaId_fkey";

-- DropForeignKey
ALTER TABLE "Generation" DROP CONSTRAINT "Generation_schemaId_fkey";

-- AlterTable
ALTER TABLE "Field" ALTER COLUMN "options" SET DEFAULT ARRAY[]::TEXT[];

-- AddForeignKey
ALTER TABLE "Field" ADD CONSTRAINT "Field_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Generation" ADD CONSTRAINT "Generation_schemaId_fkey" FOREIGN KEY ("schemaId") REFERENCES "Schema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
