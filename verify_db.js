const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function main() {
  const data = JSON.parse(fs.readFileSync('/home/aurelien/ZA-ShinyDex/sheet_data.json', 'utf8'));
  const sheetNames = new Set();
  
  // Skip header
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    // Column indices: 1 (B), 6 (G), 11 (L), 16 (Q)
    const indices = [1, 6, 11, 16];
    for (const idx of indices) {
      if (row[idx] && typeof row[idx] === 'string' && row[idx].trim() !== "" && row[idx].trim() !== "Pokémon") {
        sheetNames.add(row[idx].trim());
      }
    }
  }

  const dbPokemons = await prisma.pokemon.findMany({
    select: { name: true }
  });
  const dbNames = dbPokemons.map(p => p.name.trim());
  console.log('All names in DB:', dbNames);

  const extraInDb = dbNames.filter(name => !sheetNames.has(name));
  const missingInDb = Array.from(sheetNames).filter(name => !dbNames.includes(name));

  console.log('Extra in DB (not in sheet):', extraInDb);
  console.log('Missing in DB (in sheet but not DB):', missingInDb);
  console.log('Total in sheet:', sheetNames.size);
  console.log('Total in DB:', dbNames.length);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
