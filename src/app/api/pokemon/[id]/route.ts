import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const pokemonId = parseInt(id, 10);

    if (isNaN(pokemonId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const { isShiny, isShalpha } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const currentProgress = await prisma.userProgress.findUnique({
      where: {
        userId_pokemonId: {
          userId: user.id,
          pokemonId: pokemonId
        }
      }
    });

    const updateData: { isShiny?: boolean; isShalpha?: boolean } = {};
    
    if (typeof isShalpha === 'boolean') {
      updateData.isShalpha = isShalpha;
      if (isShalpha) updateData.isShiny = true;
    }
    
    if (typeof isShiny === 'boolean') {
      const shalphaState = typeof isShalpha === 'boolean' ? isShalpha : (currentProgress?.isShalpha || false);
      if (isShiny === false && shalphaState === true) {
        updateData.isShiny = true;
      } else {
        updateData.isShiny = isShiny;
      }
    }

    const updatedProgress = await prisma.userProgress.upsert({
      where: {
        userId_pokemonId: {
          userId: user.id,
          pokemonId: pokemonId
        }
      },
      update: updateData,
      create: {
        userId: user.id,
        pokemonId: pokemonId,
        isShiny: updateData.isShiny || false,
        isShalpha: updateData.isShalpha || false,
      }
    });

    return NextResponse.json(updatedProgress);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
