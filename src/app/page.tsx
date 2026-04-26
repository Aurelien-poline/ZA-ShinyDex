'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Fuse from 'fuse.js';

interface Pokemon {
  id: number;
  name: string;
  primaryType: string;
  secondaryType: string | null;
  isShiny: boolean;
  isShalpha: boolean;
  spriteUrl: string | null;
  shinySpriteUrl: string | null;
  nationalDexId: number | null;
  regionalDexId: number | null;
  [key: string]: any;
}

type SortOption = 'name' | 'national' | 'regional';

const SHINY_LOCKED_LIST = [
  'Xerneas', 'Yveltal', 'Zygarde', 'Diancie', 'Mewtwo', 'Heatran', 
  'Volcanion', 'Keldeo', 'Meloetta', 'Genesect', 'Hoopa', 'Marshadow', 'Meltan', 
  'Melmetal', 'Darkrai', 'Kyogre', 'Groudon', 'Rayquaza', 'Magearna', 'Zeraora'
];

export default function Home() {
  const [allPokemon, setAllPokemon] = useState<Pokemon[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedEDs, setSelectedEDs] = useState<string[]>([]);
  const [missingShiny, setMissingShiny] = useState(false);
  const [missingShalpha, setMissingShalpha] = useState(false);
  const [obtainedShiny, setObtainedShiny] = useState(false);
  const [obtainedShalpha, setObtainedShalpha] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('regional');
  const [allTypes, setAllTypes] = useState<string[]>([]);
  const [allEDs, setAllEDs] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/filters')
      .then(res => res.json())
      .then(data => {
        setAllTypes(data.types);
        setAllEDs(data.extradimensions);
      });
  }, []);

  const fetchAllPokemon = useCallback(() => {
    setLoading(true);
    fetch('/api/pokemon')
      .then(res => res.json())
      .then(data => {
        setAllPokemon(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchAllPokemon();
  }, [fetchAllPokemon]);

  const activeEDStats = useMemo(() => {
    const stats: Array<{ id: string, name: string, shiny: number, shalpha: number }> = [];
    
    allEDs.forEach(ed => {
        const inZone = allPokemon.filter(p => p[ed]);
        if (inZone.length > 0) {
            const shinyNeeded = inZone.filter(p => !p.isShiny && !SHINY_LOCKED_LIST.includes(p.name)).length;
            const shalphaNeeded = inZone.filter(p => {
                if (SHINY_LOCKED_LIST.includes(p.name)) return false;
                const pActiveEds = allEDs.filter(x => p[x]);
                const isAlphaLocked = pActiveEds.length === 1 && pActiveEds[0] === 'ED_Speciale_5';
                if (isAlphaLocked) return false;
                return !p.isShalpha;
            }).length;

            stats.push({
                id: ed,
                name: ed.replace('ED_', '').replace(/_/g, ' '),
                shiny: shinyNeeded,
                shalpha: shalphaNeeded
            });
        }
    });
    return stats.sort((a, b) => a.name.localeCompare(b.name));
  }, [allPokemon, allEDs]);

  const fuse = useMemo(() => {
    return new Fuse(allPokemon, {
      keys: ['name'],
      threshold: 0.4,
      ignoreLocation: true,
      includeMatches: true,
      findAllMatches: true,
      useExtendedSearch: true,
      getFn: (obj, path) => {
        const val = obj[path as keyof Pokemon];
        if (typeof val === 'string') {
          return val.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        }
        return val;
      }
    });
  }, [allPokemon]);

  useEffect(() => {
    let result = [...allPokemon];

    if (search.trim()) {
      const normalizedSearch = search.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      result = fuse.search(normalizedSearch).map(r => r.item);
    }

    if (selectedType) {
      result = result.filter(p => p.primaryType === selectedType || p.secondaryType === selectedType);
    }

    if (selectedEDs.length > 0) {
      result = result.filter(p => selectedEDs.some(ed => p[ed]));
    }

    if (missingShiny) result = result.filter(p => !p.isShiny && !SHINY_LOCKED_LIST.includes(p.name));
    
    if (missingShalpha) {
        result = result.filter(p => {
            if (SHINY_LOCKED_LIST.includes(p.name)) return false;
            const activeEds = allEDs.filter(ed => p[ed]);
            const isAlphaLocked = activeEds.length === 1 && activeEds[0] === 'ED_Speciale_5';
            if (isAlphaLocked) return false;
            return !p.isShalpha;
        });
    }

    if (obtainedShiny) result = result.filter(p => p.isShiny);
    if (obtainedShalpha) result = result.filter(p => p.isShalpha);

    result.sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'national') return (a.nationalDexId || 9999) - (b.nationalDexId || 9999);
        if (sortBy === 'regional') return (a.regionalDexId || 9999) - (b.regionalDexId || 9999);
        return 0;
    });

    setFilteredPokemon(result);
  }, [search, selectedType, selectedEDs, missingShiny, missingShalpha, obtainedShiny, obtainedShalpha, sortBy, allPokemon, fuse, allEDs]);

  const toggleStatus = async (id: number, field: 'isShiny' | 'isShalpha', currentValue: boolean) => {
    const newValue = !currentValue;
    setAllPokemon(prev => prev.map(p => {
        if (p.id === id) {
            const update: any = { ...p, [field]: newValue };
            if (field === 'isShalpha' && newValue === true) {
                update.isShiny = true;
            }
            return update;
        }
        return p;
    }));

    try {
        await fetch(`/api/pokemon/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [field]: newValue })
        });
    } catch (e) {
        console.error("Failed to update", e);
        fetchAllPokemon();
    }
  };

  const toggleED = (ed: string) => {
      setSelectedEDs(prev => 
        prev.includes(ed) ? prev.filter(item => item !== ed) : [...prev, ed]
      );
  };

  const getEDsForPokemon = (p: Pokemon) => {
    return allEDs.filter(ed => p[ed]);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden">
      {/* Permanent Header */}
      <header className="p-6 md:px-12 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md z-50 flex-shrink-0">
        <div className="max-w-[1600px] mx-auto flex justify-between items-center">
            <div>
                <h1 className="text-4xl font-black tracking-tighter text-white leading-none">
                LEGENDS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">ZA</span> SHINY DEX
                </h1>
                <p className="text-slate-500 text-xs font-bold mt-1 uppercase tracking-widest">Gestionnaire de collection et traqueur d'Extradimensions</p>
            </div>
            {!loading && (
                <div className="hidden md:block text-right">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest block mb-1">Base de données</span>
                    <span className="text-blue-400 font-black text-xl leading-none">{allPokemon.length} Espèces</span>
                </div>
            )}
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex flex-row overflow-hidden max-w-[1700px] mx-auto w-full relative">
        
        {/* Left Sidebar: Filters */}
        <aside className="w-72 flex-shrink-0 hidden lg:flex flex-col justify-center p-6 h-full relative z-40">
          <div className="max-h-full overflow-y-auto custom-scrollbar-hidden space-y-6 bg-slate-900/40 p-6 rounded-[2.5rem] border border-slate-800/50 shadow-xl">
            <section>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2.5">Recherche</label>
              <input
                type="text"
                placeholder="Nom du Pokémon..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </section>

            <section>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2.5">Trier par</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium transition-all appearance-none cursor-pointer text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="regional">Ordre Régional</option>
                <option value="national">Ordre National</option>
                <option value="name">Nom (A-Z)</option>
              </select>
            </section>

            <section>
              <label className="block text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2.5">Type Élémentaire</label>
              <select
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none text-white font-medium transition-all appearance-none cursor-pointer text-sm"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">Tous les types</option>
                {allTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </section>

            <section className="space-y-3">
              <p className="text-[10px] uppercase tracking-widest font-black text-slate-600 mb-1">Status</p>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="peer hidden" checked={missingShiny} onChange={(e) => setMissingShiny(e.target.checked)} />
                <div className="w-4 h-4 border-2 border-slate-700 rounded peer-checked:bg-yellow-500 peer-checked:border-yellow-500 transition-all flex items-center justify-center">
                    {missingShiny && <svg className="w-3 h-3 text-black font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Shiny manquants</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="peer hidden" checked={obtainedShiny} onChange={(e) => setObtainedShiny(e.target.checked)} />
                <div className="w-4 h-4 border-2 border-slate-700 rounded peer-checked:bg-yellow-600 peer-checked:border-yellow-600 transition-all flex items-center justify-center">
                    {obtainedShiny && <svg className="w-3 h-3 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Shiny obtenus</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group pt-1">
                <input type="checkbox" className="peer hidden" checked={missingShalpha} onChange={(e) => setMissingShalpha(e.target.checked)} />
                <div className="w-4 h-4 border-2 border-slate-700 rounded peer-checked:bg-red-500 peer-checked:border-red-500 transition-all flex items-center justify-center">
                    {missingShalpha && <svg className="w-3 h-3 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Shalpha manquants</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="peer hidden" checked={obtainedShalpha} onChange={(e) => setObtainedShalpha(e.target.checked)} />
                <div className="w-4 h-4 border-2 border-slate-700 rounded peer-checked:bg-red-700 peer-checked:border-red-700 transition-all flex items-center justify-center">
                    {obtainedShalpha && <svg className="w-3 h-3 text-white font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white transition-colors">Shalpha obtenus</span>
              </label>
            </section>
            
            <button 
              onClick={() => {
                setSearch('');
                setSelectedType('');
                setSelectedEDs([]);
                setMissingShiny(false);
                setMissingShalpha(false);
                setObtainedShiny(false);
                setObtainedShalpha(false);
                setSortBy('regional');
              }}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-red-900/40 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Réinitialiser
            </button>
          </div>
        </aside>

        {/* Center Content: Scrollable Grid */}
        <main className="flex-1 overflow-y-auto h-full p-6 md:p-8 custom-scrollbar relative z-30">
          <div className="max-w-4xl mx-auto">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronisation...</span>
                </div>
            ) : (
                <>
                <div className="mb-6 flex justify-between items-end px-2">
                    <span className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{filteredPokemon.length} Pokémon filtré(s)</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-5 pb-20">
                    {filteredPokemon.map((p) => {
                    const isShinyLocked = SHINY_LOCKED_LIST.includes(p.name);
                    const activeEds = allEDs.filter(ed => p[ed]);
                    const isAlphaLocked = activeEds.length === 1 && activeEds[0] === 'ED_Speciale_5';

                    return (
                        <div key={p.id} className="bg-slate-900 rounded-[2.5rem] p-6 border border-slate-800 hover:border-blue-500/50 transition-all shadow-xl flex flex-col relative overflow-hidden group">
                            <div className="absolute -top-6 -right-6 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-all"></div>
                            
                            <div className="grid grid-cols-[1fr_80px] gap-3 items-start z-10">
                                <div className="min-w-0 flex flex-col">
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="text-[9px] font-black text-slate-500 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">#{p.nationalDexId || '???'}</span>
                                        <span className="text-[9px] font-black text-blue-500/70">REG #{p.regionalDexId || '???'}</span>
                                    </div>
                                    <h3 className={`font-black text-white group-hover:text-blue-300 transition-colors leading-tight drop-shadow-sm whitespace-normal break-normal ${p.name.length > 15 ? 'text-lg' : 'text-xl'}`}>
                                        {p.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-[9px] font-black uppercase tracking-tighter bg-slate-700 px-2 py-0.5 rounded-lg text-slate-100 border border-slate-600">{p.primaryType}</span>
                                        {p.secondaryType && <span className="text-[9px] font-black uppercase tracking-tighter bg-slate-700 px-2 py-0.5 rounded-lg text-slate-100 border border-slate-600">{p.secondaryType}</span>}
                                    </div>
                                </div>
                                
                                <div className="relative w-20 h-20 -mt-2 -mr-2 flex-shrink-0 flex items-center justify-center">
                                    {p.spriteUrl && (
                                        <img 
                                            src={p.isShiny ? (p.shinySpriteUrl || p.spriteUrl) : p.spriteUrl} 
                                            alt={p.name}
                                            className="w-full h-full object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                                            loading="lazy"
                                        />
                                    )}
                                    {!isShinyLocked && p.isShiny && (
                                        <div className="absolute top-0 right-0 animate-bounce flex flex-col items-center">
                                            <span className="text-lg leading-none">✨</span>
                                            {p.isShalpha && (
                                                <img 
                                                    src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e8ddc4da-23dd-4502-b65b-378c9cfe5efa/dffxy6z-3d129c25-9342-4ef5-8d13-e91c4ccc6888.png/v1/fill/w_1280,h_1280/alpha_pokemon_symbol_by_jormxdos_dffxy6z-fullview.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTI4MCIsInBhdGgiOiIvZi9lOGRkYzRkYS0yM2RkLTQ1MDItYjY1Yi0zNzhjOWNmZTVlZmEvZGZmeHk2ei0zZDEyOWMyNS05MzQyLTRlZjUtOGQxMy1lOTFjNGNjYzY4ODgucG5nIiwid2lkdGgiOiI8PTEyODAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.TEiWjx-bm9P9AmKczuG0lZlMQNS9cYXsEUBtl7LeQzY" 
                                                    alt="Alpha"
                                                    className="w-5 h-5 object-contain mt-1 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]"
                                                />
                                            )}
                                        </div>
                                    )}
                                    {isShinyLocked && <div className="absolute top-0 right-0"><span className="text-lg">🔒</span></div>}
                                </div>
                            </div>

                            <div className="mt-6 space-y-4 z-10">
                                <div className="flex gap-3">
                                    {isShinyLocked ? (
                                        <div className="flex-1 py-2 px-3 rounded-xl border-2 border-slate-800 bg-slate-950/50 text-slate-500 text-[9px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2">
                                            <span>SHINY LOCKED</span>
                                        </div>
                                    ) : (
                                        <>
                                            <button 
                                                onClick={() => toggleStatus(p.id, 'isShiny', p.isShiny)}
                                                className={`flex-1 py-2 px-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                                                    p.isShiny 
                                                    ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' 
                                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                                }`}
                                            >
                                                Shiny
                                            </button>
                                            {isAlphaLocked ? (
                                                <div className="flex-1 py-2 px-3 rounded-xl border-2 border-slate-800 bg-slate-950/50 text-slate-600 text-[9px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2 cursor-not-allowed">
                                                    <span>ALPHA LOCKED</span>
                                                    <span>🔒</span>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => toggleStatus(p.id, 'isShalpha', p.isShalpha)}
                                                    className={`flex-1 py-2 px-3 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all ${
                                                        p.isShalpha 
                                                        ? 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                                        : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                                    }`}
                                                >
                                                    Shalpha
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800 min-h-[80px]">
                                    <p className="text-[9px] uppercase tracking-widest text-slate-500 font-black mb-2">Localisations</p>
                                    <div className="flex flex-wrap gap-1.5">
                                    {getEDsForPokemon(p).map(ed => (
                                        <span key={ed} className="text-[9px] font-bold bg-slate-800 text-slate-200 px-2 py-0.5 rounded-full border border-slate-700">
                                            {ed.replace('ED_', '').replace(/_/g, ' ')}
                                        </span>
                                    ))}
                                    {getEDsForPokemon(p).length === 0 && <span className="text-[9px] text-slate-600 font-bold italic">Évolution uniquement</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                    })}
                </div>
                
                {!loading && filteredPokemon.length === 0 && (
                    <div className="text-center py-40">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-black text-slate-400">Aucun résultat trouvé</h3>
                    </div>
                )}
                </>
            )}
          </div>
        </main>

        {/* Right Sidebar: Extradimensions */}
        <aside className="w-80 flex-shrink-0 hidden lg:flex flex-col justify-center p-6 h-full relative z-40">
          <div className="bg-slate-900/50 rounded-[2.5rem] border border-slate-800/50 backdrop-blur-sm flex flex-col max-h-full overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800/50 bg-slate-900/80 rounded-t-[2.5rem]">
                <h2 className="text-sm font-black uppercase tracking-widest text-white">Extradimensions</h2>
                <p className="text-[10px] text-slate-500 font-bold mt-1">Sélecteur de zones & Progression</p>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar-hidden">
                <div className="space-y-2 pb-2">
                    {activeEDStats.map(zone => {
                        const isSelected = selectedEDs.includes(zone.id);
                        const isShinyDone = zone.shiny === 0;
                        const isShalphaDone = zone.shalpha === 0;

                        return (
                            <button 
                                key={zone.id}
                                onClick={() => toggleED(zone.id)}
                                className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between group ${
                                    isSelected 
                                    ? 'bg-blue-500/20 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-600'
                                }`}
                            >
                                <div className="flex items-center gap-3 min-w-0 pr-2">
                                    <div className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                                        isSelected ? 'bg-blue-500 border-blue-500' : 'border-slate-700 group-hover:border-slate-500'
                                    }`}>
                                        {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" /></svg>}
                                    </div>
                                    <p className={`text-xs font-black transition-colors truncate ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                        {zone.name}
                                    </p>
                                </div>
                                
                                <div className="flex gap-2 text-[10px] font-black flex-shrink-0 items-center">
                                    {isShinyDone ? (
                                        <span className="text-yellow-500 text-xs font-black">✓</span>
                                    ) : (
                                        <span className="px-1.5 py-0.5 rounded-md bg-yellow-500/10 text-yellow-500">
                                            {zone.shiny}
                                        </span>
                                    )}
                                    {isShalphaDone ? (
                                        <span className="text-red-500 text-xs font-black">✓</span>
                                    ) : (
                                        <span className="px-1.5 py-0.5 rounded-md bg-red-500/10 text-red-500">
                                            {zone.shalpha}
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
          border: 2px solid rgba(15, 23, 42, 0.5);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
        .custom-scrollbar-hidden::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
