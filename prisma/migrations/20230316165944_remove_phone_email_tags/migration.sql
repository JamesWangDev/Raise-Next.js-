-- AlterTable
ALTER TABLE "emails" ADD COLUMN     "remove_date" TIMESTAMP(3),
ADD COLUMN     "remove_user" UUID;

-- AlterTable
ALTER TABLE "phone_numbers" ADD COLUMN     "remove_date" TIMESTAMP(3),
ADD COLUMN     "remove_user" UUID;

-- AlterTable
ALTER TABLE "pledges" ADD COLUMN     "remove_date" TIMESTAMP(3),
ADD COLUMN     "remove_user" UUID;

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "remove_date" TIMESTAMP(3),
ADD COLUMN     "remove_user" UUID;
