-- CreateTable
CREATE TABLE "VisualProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "VisualProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "VisualProfile_userId_key" ON "VisualProfile"("userId");
