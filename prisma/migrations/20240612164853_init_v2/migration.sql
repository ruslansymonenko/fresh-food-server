-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'ADMIN', 'MANAGER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "user_role" "UserRole" NOT NULL DEFAULT 'CUSTOMER';
