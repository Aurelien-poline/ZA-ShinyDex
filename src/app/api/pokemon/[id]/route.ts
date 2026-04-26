import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pokemonId = parseInt(id, 10);

    if (isNaN(pokemonId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { isShiny, isShalpha } = body;

    const data: { isShiny?: boolean; isShalpha?: boolean } = {};
    if (typeof isShalpha === 'boolean') {
        data.isShalpha = isShalpha;
        if (isShalpha) {
            // Rule: if shalpha is true, shiny must be true
            data.isShiny = true;
        }
    }
    
    if (typeof isShiny === 'boolean') {
        // If we are setting isShiny to false but isShalpha is true, we must keep isShiny true?
        // Actually, if a user unchecks shiny, they probably want to uncheck shalpha too?
        // Let's check current state
        const current = await prisma.pokemon.findUnique({ where: { id: pokemonId } });
        if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        if (isShiny === false && (data.isShalpha === true || (typeof isShalpha === 'undefined' && current.isShalpha))) {
            // Cannot have shalpha without shiny
            data.isShiny = true; 
        } else {
            data.isShiny = isShiny;
        }
    }

    const updated = await prisma.pokemon.update({
      where: { id: pokemonId },
      data
    });

    return NextResponse.json(updated);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
