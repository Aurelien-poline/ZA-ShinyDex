import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  const type = searchParams.get('type');
  const missingShiny = searchParams.get('missingShiny') === 'true';
  const missingShalpha = searchParams.get('missingShalpha') === 'true';
  const extradimension = searchParams.get('extradimension');

  const where: Record<string, any> = {};

  if (name) {
    where.name = { contains: name };
  }

  if (type) {
    where.OR = [
      { primaryType: type },
      { secondaryType: type }
    ];
  }

  if (missingShiny) {
    where.isShiny = false;
  }

  if (missingShalpha) {
    where.isShalpha = false;
  }

  if (extradimension) {
    where[extradimension] = true;
  }

  try {
    const pokemon = await prisma.pokemon.findMany({
      where,
      select: {
        id: true,
        name: true,
        nameEn: true,
        nameJa: true,
        primaryType: true,
        secondaryType: true,
        isShiny: true,
        isShalpha: true,
        spriteUrl: true,
        shinySpriteUrl: true,
        nationalDexId: true,
        regionalDexId: true,
        ED_Acier_1: true,
        ED_Acier_2: true,
        ED_Acier_3: true,
        ED_Acier_4: true,
        ED_Acier_5_Speciale: true,
        ED_Combat_1: true,
        ED_Combat_2: true,
        ED_Combat_3: true,
        ED_Combat_4: true,
        ED_Combat_5_Speciale: true,
        ED_Dragon_1: true,
        ED_Dragon_2: true,
        ED_Dragon_3: true,
        ED_Dragon_4: true,
        ED_Dragon_5_Speciale: true,
        ED_Eau_1: true,
        ED_Eau_2: true,
        ED_Eau_3: true,
        ED_Eau_4: true,
        ED_Eau_5_Speciale: true,
        ED_Feu_1: true,
        ED_Feu_2: true,
        ED_Feu_3: true,
        ED_Feu_4: true,
        ED_Feu_5_Speciale: true,
        ED_Fée_1: true,
        ED_Fée_2: true,
        ED_Fée_3: true,
        ED_Fée_4: true,
        ED_Fée_5_Speciale: true,
        ED_Glace_1: true,
        ED_Glace_2: true,
        ED_Glace_3: true,
        ED_Glace_4: true,
        ED_Glace_5_Speciale: true,
        ED_Insecte_1: true,
        ED_Insecte_2: true,
        ED_Insecte_3: true,
        ED_Insecte_4: true,
        ED_Insecte_5_Speciale: true,
        ED_Normal_1: true,
        ED_Normal_2: true,
        ED_Normal_3: true,
        ED_Normal_4: true,
        ED_Normal_5_Speciale: true,
        ED_Plante_1: true,
        ED_Plante_2: true,
        ED_Plante_3: true,
        ED_Plante_4: true,
        ED_Plante_5_Speciale: true,
        ED_Poison_1: true,
        ED_Poison_2: true,
        ED_Poison_3: true,
        ED_Poison_4: true,
        ED_Poison_5_Speciale: true,
        ED_Psy_1: true,
        ED_Psy_2: true,
        ED_Psy_3: true,
        ED_Psy_4: true,
        ED_Psy_5_Speciale: true,
        ED_Roche_1: true,
        ED_Roche_2: true,
        ED_Roche_3: true,
        ED_Roche_4: true,
        ED_Roche_5_Speciale: true,
        ED_Sol_1: true,
        ED_Sol_2: true,
        ED_Sol_3: true,
        ED_Sol_4: true,
        ED_Sol_5_Speciale: true,
        ED_Speciale_5: true,
        ED_Spectre_1: true,
        ED_Spectre_2: true,
        ED_Spectre_3: true,
        ED_Spectre_4: true,
        ED_Spectre_5_Speciale: true,
        ED_Ténèbres_1: true,
        ED_Ténèbres_2: true,
        ED_Ténèbres_3: true,
        ED_Ténèbres_4: true,
        ED_Ténèbres_5_Speciale: true,
        ED_Vol_1: true,
        ED_Vol_2: true,
        ED_Vol_3: true,
        ED_Vol_4: true,
        ED_Vol_5_Speciale: true,
        ED_Électrik_1: true,
        ED_Électrik_2: true,
        ED_Électrik_3: true,
        ED_Électrik_4: true,
        ED_Électrik_5_Speciale: true,
      },
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(pokemon);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch pokemon' }, { status: 500 });
  }
}
