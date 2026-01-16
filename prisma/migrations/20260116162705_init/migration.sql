-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('FREE', 'PREMIUM', 'PREMIUM_PLUS', 'FAMILY');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('VIDEO', 'AUDIO', 'TEXT');

-- CreateEnum
CREATE TYPE "DeliveryType" AS ENUM ('SPECIFIC_DATE', 'UPON_PASSING', 'MILESTONE', 'SURPRISE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'DELIVERED');

-- CreateEnum
CREATE TYPE "Milestone" AS ENUM ('BIRTHDAY', 'WEDDING', 'GRADUATION', 'ANNIVERSARY', 'FIRST_CHILD', 'RETIREMENT', 'NEW_YEAR', 'CHRISTMAS', 'OTHER');

-- CreateEnum
CREATE TYPE "Relationship" AS ENUM ('CHILD', 'SPOUSE', 'PARENT', 'SIBLING', 'FRIEND', 'OTHER');

-- CreateEnum
CREATE TYPE "SubscriptionPlan" AS ENUM ('PREMIUM', 'PREMIUM_PLUS', 'FAMILY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT,
    "birthday" TIMESTAMP(3),
    "avatar" TEXT,
    "plan" "Plan" NOT NULL DEFAULT 'FREE',
    "storageUsed" INTEGER NOT NULL DEFAULT 0,
    "messageCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "content" TEXT,
    "thumbnail" TEXT,
    "duration" INTEGER,
    "recipientId" TEXT NOT NULL,
    "deliveryType" "DeliveryType" NOT NULL,
    "scheduledDate" TIMESTAMP(3),
    "milestone" "Milestone",
    "status" "MessageStatus" NOT NULL DEFAULT 'DRAFT',
    "deliveredAt" TIMESTAMP(3),
    "viewedAt" TIMESTAMP(3),
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "relationship" "Relationship" NOT NULL,
    "birthday" TIMESTAMP(3),
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "trustees" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "verificationCode" TEXT NOT NULL,
    "notified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trustees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "responses" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" "MessageType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "messages_userId_idx" ON "messages"("userId");

-- CreateIndex
CREATE INDEX "messages_recipientId_idx" ON "messages"("recipientId");

-- CreateIndex
CREATE INDEX "messages_status_idx" ON "messages"("status");

-- CreateIndex
CREATE INDEX "messages_scheduledDate_idx" ON "messages"("scheduledDate");

-- CreateIndex
CREATE INDEX "recipients_userId_idx" ON "recipients"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_userId_email_key" ON "recipients"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "trustees_userId_key" ON "trustees"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "trustees_verificationCode_key" ON "trustees"("verificationCode");

-- CreateIndex
CREATE INDEX "trustees_email_idx" ON "trustees"("email");

-- CreateIndex
CREATE INDEX "trustees_verificationCode_idx" ON "trustees"("verificationCode");

-- CreateIndex
CREATE INDEX "responses_messageId_idx" ON "responses"("messageId");

-- CreateIndex
CREATE INDEX "responses_recipientId_idx" ON "responses"("recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeCustomerId_key" ON "subscriptions"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "subscriptions_stripeCustomerId_idx" ON "subscriptions"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recipients" ADD CONSTRAINT "recipients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trustees" ADD CONSTRAINT "trustees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "responses" ADD CONSTRAINT "responses_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "recipients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
