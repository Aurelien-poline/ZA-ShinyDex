import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  const type = searchParams.get('type');
  const missingShiny = searchParams.get('missingShiny') === 'true';
  const missingShalpha = searchParams.get('missingShalpha') === 'true';
  const extradimension = searchParams.get('extradimension');

  const where: any = {};

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
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(pokemon);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch pokemon' }, { status: 500 });
  }
}
