import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { progress } = body; // Expected: { "pokemonId": { isShiny: bool, isShalpha: boolean }, ... }

    if (!progress || typeof progress !== 'object') {
      return NextResponse.json({ error: 'Invalid progress data' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const migrationPromises = Object.entries(progress).map(([id, data]: [string, any]) => {
      const pokemonId = parseInt(id, 10);
      return prisma.userProgress.upsert({
        where: {
          userId_pokemonId: {
            userId: user.id,
            pokemonId: pokemonId
          }
        },
        update: {
          isShiny: data.isShiny,
          isShalpha: data.isShalpha
        },
        create: {
          userId: user.id,
          pokemonId: pokemonId,
          isShiny: data.isShiny,
          isShalpha: data.isShalpha
        }
      });
    });

    await Promise.all(migrationPromises);

    return NextResponse.json({ message: 'Migration successful', count: migrationPromises.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
