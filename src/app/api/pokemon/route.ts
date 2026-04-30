import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const searchParams = request.nextUrl.searchParams;
  const name = searchParams.get('name');
  const type = searchParams.get('type');
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

  if (extradimension) {
    where[extradimension] = true;
  }

  try {
    const pokemon = await prisma.pokemon.findMany({
      where,
      include: {
        userProgress: session?.user?.email ? {
          where: {
            user: {
              email: session.user.email
            }
          }
        } : false
      },
      orderBy: { name: 'asc' }
    });

    const result = pokemon.map(p => {
      const progress = p.userProgress?.[0];
      const { userProgress, ...rest } = p;
      return {
        ...rest,
        isShiny: progress?.isShiny || false,
        isShalpha: progress?.isShalpha || false,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch pokemon' }, { status: 500 });
  }
}
