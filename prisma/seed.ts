import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const dataPath = path.join(__dirname, 'seed_data.json');
  if (!fs.existsSync(dataPath)) {
    console.error("Seed data file not found!");
    process.exit(1);
  }

  const pokemon = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`Seeding ${pokemon.length} Pokémon entries...`);

  for (const p of pokemon) {
    await prisma.pokemon.upsert({
      where: { name: p.name },
      update: p,
      create: p,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
