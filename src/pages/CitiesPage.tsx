import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CITIES } from '../data/cities';

const FACTION_COLORS: Record<string, string> = {
  chalexis: '#9090b0',
  iaryx: '#7ab5a0',
  halkir: '#c9a84c',
  neutral: '#8a7a6a',
};

export function CitiesPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 px-4">
      <h1 className="font-display text-4xl text-codex-parchment mb-3">Cities of the Empire</h1>
      <p className="text-codex-parchmentDim mb-8">The major settlements of the Hanacene Empire and their lords.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
        {CITIES.map((city, i) => (
          <motion.div
            key={city.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="h-full"
          >
            <Link
              to={`/cities/${city.id}`}
              className="group flex h-full flex-col p-5 bg-codex-surface border border-codex-border rounded-lg hover:border-codex-gold transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-1">
                <h2 className="font-display text-xl text-codex-parchment group-hover:text-codex-gold transition-colors">
                  {city.name}
                  {city.isCapital && <span className="ml-2 text-codex-gold text-xs">★ Capital</span>}
                </h2>
                <span className="text-xs font-display px-2 py-0.5 rounded capitalize" style={{ color: FACTION_COLORS[city.faction] ?? '#888' }}>
                  {city.faction}
                </span>
              </div>
              <div className="text-codex-parchmentDim text-sm mb-2">{city.province} · Pop. {city.population.toLocaleString()}</div>
              {/* min-h reserves space for two lines of tagline so single-line
                  taglines (like Hanach's) don't shrink the card relative to
                  cards with wrapped two-line taglines. */}
              <p className="text-codex-parchmentDim/80 text-sm leading-relaxed line-clamp-2 min-h-[2.75rem]">{city.tagline}</p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
