-- Run this SQL in Supabase SQL Editor to create all tables
-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "servizio" TEXT NOT NULL DEFAULT '',
    "tipoServizio" TEXT NOT NULL DEFAULT '',
    "elevatorPitch" TEXT NOT NULL DEFAULT '',
    "differenziatore" TEXT NOT NULL DEFAULT '',
    "clienteIdeale" TEXT NOT NULL DEFAULT '',
    "settore" TEXT NOT NULL DEFAULT '',
    "dimensioneAzienda" TEXT NOT NULL DEFAULT '',
    "problemaCliente" TEXT NOT NULL DEFAULT '',
    "risultatoCliente" TEXT NOT NULL DEFAULT '',
    "segnaliInteresse" TEXT NOT NULL DEFAULT '',
    "obiezioneFrequente" TEXT NOT NULL DEFAULT '',
    "modelloVendita" TEXT NOT NULL DEFAULT '',
    "ticketMedio" TEXT NOT NULL DEFAULT '',
    "cicloVendita" TEXT NOT NULL DEFAULT '',
    "ctaPreferita" TEXT NOT NULL DEFAULT '',
    "tempoSettimanale" TEXT NOT NULL DEFAULT '',
    "statoLinkedin" TEXT NOT NULL DEFAULT '',
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "sitoWeb" TEXT NOT NULL DEFAULT '',
    "linkedinLinks" TEXT NOT NULL DEFAULT '[]',
    "materialiNomi" TEXT NOT NULL DEFAULT '[]',
    "socialLinks" TEXT NOT NULL DEFAULT '[]',
    "toneSamples" TEXT NOT NULL DEFAULT '[]',
    "setupComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VisualProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryColor" TEXT NOT NULL DEFAULT '#3B82F6',
    "secondaryColor" TEXT NOT NULL DEFAULT '#10B981',
    "backgroundColor" TEXT NOT NULL DEFAULT 'clean',
    "visualTone" TEXT NOT NULL DEFAULT 'professional',
    "typographyPreset" TEXT NOT NULL DEFAULT 'modern',
    "contentStylePersonality" TEXT NOT NULL DEFAULT 'founder',
    "photoStrategy" TEXT NOT NULL DEFAULT 'hybrid',
    "stylePreset" TEXT NOT NULL DEFAULT 'minimal_corporate',
    "colorSuggestions" TEXT NOT NULL DEFAULT '[]',
    "designNotes" TEXT NOT NULL DEFAULT '',
    "setupComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VisualProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prospect" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "websiteUrl" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL DEFAULT '',
    "role" TEXT NOT NULL DEFAULT '',
    "company" TEXT NOT NULL DEFAULT '',
    "sector" TEXT NOT NULL DEFAULT '',
    "heatLevel" TEXT NOT NULL DEFAULT 'Cold',
    "priority" TEXT NOT NULL DEFAULT 'low',
    "summary" TEXT NOT NULL DEFAULT '',
    "lastAnalysis" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prospect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taskType" TEXT NOT NULL,
    "inputSummary" TEXT NOT NULL DEFAULT '',
    "outputSummary" TEXT NOT NULL DEFAULT '',
    "fullOutput" TEXT NOT NULL DEFAULT '',
    "prospectId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrategicMemory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "summary" TEXT NOT NULL DEFAULT '',
    "patterns" TEXT NOT NULL DEFAULT '',
    "focusArea" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StrategicMemory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SystemProfile_userId_key" ON "SystemProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VisualProfile_userId_key" ON "VisualProfile"("userId");

-- CreateIndex
CREATE INDEX "Prospect_userId_idx" ON "Prospect"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Prospect_userId_linkedinUrl_key" ON "Prospect"("userId", "linkedinUrl");

-- CreateIndex
CREATE INDEX "AIActivity_userId_taskType_idx" ON "AIActivity"("userId", "taskType");

-- CreateIndex
CREATE INDEX "AIActivity_userId_createdAt_idx" ON "AIActivity"("userId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StrategicMemory_userId_key" ON "StrategicMemory"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SystemProfile" ADD CONSTRAINT "SystemProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisualProfile" ADD CONSTRAINT "VisualProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prospect" ADD CONSTRAINT "Prospect_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIActivity" ADD CONSTRAINT "AIActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIActivity" ADD CONSTRAINT "AIActivity_prospectId_fkey" FOREIGN KEY ("prospectId") REFERENCES "Prospect"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StrategicMemory" ADD CONSTRAINT "StrategicMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

