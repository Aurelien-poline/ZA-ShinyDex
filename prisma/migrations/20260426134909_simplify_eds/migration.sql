/*
  Warnings:

  - You are about to drop the column `ED_Acier_3_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Acier_4_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Combat_1_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Combat_3_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Combat_4_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Combat_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Dragon_3_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Dragon_4_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Dragon_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Eau_2_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Eau_4_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Eau_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Feu_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Fée_2_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Fée_4_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Glace_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Normal_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Plante_2_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Plante_3_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Plante_4_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Plante_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Poison_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Psy_2_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Psy_3_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Psy_4_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Roche_3_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Roche_4_Speciale` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Roche_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Spectre_5` on the `Pokemon` table. All the data in the column will be lost.
  - You are about to drop the column `ED_Électrik_5` on the `Pokemon` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pokemon" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "primaryType" TEXT NOT NULL,
    "secondaryType" TEXT,
    "isShiny" BOOLEAN NOT NULL DEFAULT false,
    "isShalpha" BOOLEAN NOT NULL DEFAULT false,
    "ED_Acier_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Acier_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Acier_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Acier_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Acier_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Combat_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Combat_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Combat_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Combat_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Combat_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Dragon_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Dragon_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Dragon_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Dragon_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Dragon_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Eau_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Eau_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Eau_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Eau_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Eau_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Feu_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Feu_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Feu_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Feu_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Feu_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Fée_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Fée_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Fée_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Fée_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Fée_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Glace_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Glace_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Glace_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Glace_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Glace_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Insecte_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Insecte_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Insecte_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Insecte_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Insecte_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Normal_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Normal_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Normal_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Normal_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Normal_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Plante_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Plante_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Plante_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Plante_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Plante_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Poison_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Poison_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Poison_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Poison_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Poison_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Psy_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Psy_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Psy_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Psy_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Psy_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Roche_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Roche_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Roche_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Roche_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Roche_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Sol_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Sol_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Sol_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Sol_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Sol_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Speciale_5" BOOLEAN NOT NULL DEFAULT false,
    "ED_Spectre_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Spectre_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Spectre_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Spectre_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Spectre_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Ténèbres_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Ténèbres_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Ténèbres_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Ténèbres_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Ténèbres_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Vol_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Vol_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Vol_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Vol_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Vol_5_Speciale" BOOLEAN NOT NULL DEFAULT false,
    "ED_Électrik_1" BOOLEAN NOT NULL DEFAULT false,
    "ED_Électrik_2" BOOLEAN NOT NULL DEFAULT false,
    "ED_Électrik_3" BOOLEAN NOT NULL DEFAULT false,
    "ED_Électrik_4" BOOLEAN NOT NULL DEFAULT false,
    "ED_Électrik_5_Speciale" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Pokemon" ("ED_Acier_2", "ED_Acier_3", "ED_Acier_4", "ED_Acier_5_Speciale", "ED_Combat_1", "ED_Combat_3", "ED_Combat_4", "ED_Combat_5_Speciale", "ED_Dragon_3", "ED_Dragon_4", "ED_Dragon_5_Speciale", "ED_Eau_2", "ED_Eau_3", "ED_Eau_4", "ED_Eau_5_Speciale", "ED_Feu_2", "ED_Feu_3", "ED_Feu_4", "ED_Fée_2", "ED_Fée_3", "ED_Fée_4", "ED_Fée_5_Speciale", "ED_Glace_3", "ED_Glace_4", "ED_Insecte_1", "ED_Insecte_4", "ED_Normal_1", "ED_Normal_2", "ED_Normal_3", "ED_Normal_4", "ED_Plante_2", "ED_Plante_3", "ED_Plante_4", "ED_Plante_5_Speciale", "ED_Poison_1", "ED_Poison_3", "ED_Poison_4", "ED_Psy_1", "ED_Psy_3", "ED_Psy_4", "ED_Psy_5_Speciale", "ED_Roche_3", "ED_Roche_4", "ED_Roche_5_Speciale", "ED_Sol_1", "ED_Sol_3", "ED_Sol_4", "ED_Speciale_5", "ED_Spectre_1", "ED_Spectre_3", "ED_Spectre_4", "ED_Ténèbres_1", "ED_Ténèbres_3", "ED_Ténèbres_4", "ED_Vol_1", "ED_Vol_3", "ED_Vol_4", "ED_Électrik_2", "ED_Électrik_3", "ED_Électrik_4", "id", "isShalpha", "isShiny", "name", "primaryType", "secondaryType") SELECT "ED_Acier_2", "ED_Acier_3", "ED_Acier_4", "ED_Acier_5_Speciale", "ED_Combat_1", "ED_Combat_3", "ED_Combat_4", "ED_Combat_5_Speciale", "ED_Dragon_3", "ED_Dragon_4", "ED_Dragon_5_Speciale", "ED_Eau_2", "ED_Eau_3", "ED_Eau_4", "ED_Eau_5_Speciale", "ED_Feu_2", "ED_Feu_3", "ED_Feu_4", "ED_Fée_2", "ED_Fée_3", "ED_Fée_4", "ED_Fée_5_Speciale", "ED_Glace_3", "ED_Glace_4", "ED_Insecte_1", "ED_Insecte_4", "ED_Normal_1", "ED_Normal_2", "ED_Normal_3", "ED_Normal_4", "ED_Plante_2", "ED_Plante_3", "ED_Plante_4", "ED_Plante_5_Speciale", "ED_Poison_1", "ED_Poison_3", "ED_Poison_4", "ED_Psy_1", "ED_Psy_3", "ED_Psy_4", "ED_Psy_5_Speciale", "ED_Roche_3", "ED_Roche_4", "ED_Roche_5_Speciale", "ED_Sol_1", "ED_Sol_3", "ED_Sol_4", "ED_Speciale_5", "ED_Spectre_1", "ED_Spectre_3", "ED_Spectre_4", "ED_Ténèbres_1", "ED_Ténèbres_3", "ED_Ténèbres_4", "ED_Vol_1", "ED_Vol_3", "ED_Vol_4", "ED_Électrik_2", "ED_Électrik_3", "ED_Électrik_4", "id", "isShalpha", "isShiny", "name", "primaryType", "secondaryType" FROM "Pokemon";
DROP TABLE "Pokemon";
ALTER TABLE "new_Pokemon" RENAME TO "Pokemon";
CREATE UNIQUE INDEX "Pokemon_name_key" ON "Pokemon"("name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
