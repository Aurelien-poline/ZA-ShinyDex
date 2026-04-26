import { NextResponse } from 'next/server';

export async function GET() {
  const types = [
    "Acier", "Combat", "Dragon", "Eau", "Feu", "Fée", "Glace", "Insecte", "Normal", "Plante", "Poison", "Psy", "Roche", "Sol", "Spectre", "Ténèbres", "Vol", "Électrik"
  ];

  const extradimensions: string[] = [];
  types.forEach(t => {
      for (let i = 1; i <= 4; i++) {
          extradimensions.push(`ED_${t}_${i}`);
      }
      extradimensions.push(`ED_${t}_5_Speciale`);
  });
  extradimensions.push("ED_Speciale_5");
  extradimensions.sort();

  return NextResponse.json({ types, extradimensions });
}
