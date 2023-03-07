-- AlterTable
ALTER TABLE "call_sessions" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();

-- AlterTable
ALTER TABLE "donations" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();

-- AlterTable
ALTER TABLE "emails" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();

-- AlterTable
ALTER TABLE "files" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();

-- AlterTable
ALTER TABLE "import_batches" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();

-- AlterTable
ALTER TABLE "interactions" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();

-- AlterTable
ALTER TABLE "people" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();

-- AlterTable
ALTER TABLE "phone_numbers" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();

-- AlterTable
ALTER TABLE "pledges" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();

-- AlterTable
ALTER TABLE "saved_lists" ALTER COLUMN "organization_id" SET DEFAULT requesting_org_id();
