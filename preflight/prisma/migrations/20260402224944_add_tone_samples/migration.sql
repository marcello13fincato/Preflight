-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SystemProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "SystemProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_SystemProfile" ("cicloVendita", "clienteIdeale", "createdAt", "ctaPreferita", "differenziatore", "dimensioneAzienda", "elevatorPitch", "id", "linkedinLinks", "linkedinUrl", "materialiNomi", "modelloVendita", "obiezioneFrequente", "problemaCliente", "risultatoCliente", "segnaliInteresse", "servizio", "settore", "setupComplete", "sitoWeb", "socialLinks", "statoLinkedin", "tempoSettimanale", "ticketMedio", "tipoServizio", "updatedAt", "userId") SELECT "cicloVendita", "clienteIdeale", "createdAt", "ctaPreferita", "differenziatore", "dimensioneAzienda", "elevatorPitch", "id", "linkedinLinks", "linkedinUrl", "materialiNomi", "modelloVendita", "obiezioneFrequente", "problemaCliente", "risultatoCliente", "segnaliInteresse", "servizio", "settore", "setupComplete", "sitoWeb", "socialLinks", "statoLinkedin", "tempoSettimanale", "ticketMedio", "tipoServizio", "updatedAt", "userId" FROM "SystemProfile";
DROP TABLE "SystemProfile";
ALTER TABLE "new_SystemProfile" RENAME TO "SystemProfile";
CREATE UNIQUE INDEX "SystemProfile_userId_key" ON "SystemProfile"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
