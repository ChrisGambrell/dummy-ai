-- AlterTable
ALTER TABLE "Schema" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Schema" ADD CONSTRAINT "Schema_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
