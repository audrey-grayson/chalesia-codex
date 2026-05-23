import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FACTIONS } from '../data/factions';

export function FactionsPage() {
  const warFactions = FACTIONS.filter(f => f.type === 'civil-war-faction');
  const houses = FACTIONS.filter(f => f.type === 'noble-house');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 px-4">
      <h1 className="font-display text-4xl text-codex-parchment mb-2">Factions & Noble Houses</h1>
      <p className="text-codex-parchmentDim mb-8">The three claimants and the great houses that back them.</p>

      <section className="mb-10">
        <h2 className="font-display text-2xl text-codex-gold mb-4">The Three Claimants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {warFactions.map(f => (
            <Link key={f.id} to={`/factions/${f.id}`}
              className="group block p-5 bg-codex-surface border border-codex-border rounded-lg hover:border-codex-gold transition-all duration-200 text-center">
              <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center">
                {f.crestImage ? (
                  <img
                    src={f.crestImage}
                    alt={`${f.name} crest`}
                    className="w-16 h-16 object-contain drop-shadow-lg"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl border-2"
                    style={{ borderColor: f.color, background: f.color + '22' }}>⚔</div>
                )}
              </div>
              <h3 className="font-display text-lg group-hover:text-codex-gold transition-colors mb-1" style={{ color: f.color }}>
                {f.name}
              </h3>
              <p className="text-codex-parchmentDim text-sm leading-relaxed">{f.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-codex-gold mb-4">Noble Houses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {houses.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/factions/${f.id}`}
                className="group block p-5 bg-codex-surface border border-codex-border rounded-lg hover:border-codex-gold transition-all duration-200">
                <div className="flex items-center gap-3 mb-2">
                  {f.crestImage ? (
                    <img
                      src={f.crestImage}
                      alt={`${f.name} arms`}
                      className="w-10 h-10 object-contain flex-shrink-0"
                    />
                  ) : (
                    <span className="w-10 h-10 rounded-full inline-flex items-center justify-center flex-shrink-0 border"
                      style={{ background: f.color + '22', borderColor: f.color + '66' }}>
                      <span className="w-3 h-3 rounded-full" style={{ background: f.color }} />
                    </span>
                  )}
                  <h3 className="font-display text-xl text-codex-parchment group-hover:text-codex-gold transition-colors">{f.name}</h3>
                </div>
                <p className="text-codex-parchmentDim text-sm leading-relaxed">{f.tagline}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
