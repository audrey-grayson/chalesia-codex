import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FEATURED = [
  { to: '/map', icon: '🗺', title: 'The Map', desc: 'Explore the Hanacene Empire and surrounding realms' },
  { to: '/cities', icon: '🏰', title: 'Cities', desc: 'Hanach, Zorlatra, Pelath and more' },
  { to: '/factions', icon: '⚜', title: 'Factions & Houses', desc: 'The three claimants and their noble allies' },
  { to: '/gods', icon: '✦', title: 'The Pantheon', desc: 'Nine gods of Chalesia and the Old Powers' },
];

export function HomePage() {
  return (
    <div className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <div className="text-codex-gold/40 font-display text-xs tracking-[0.3em] uppercase mb-4">
          Year 398 of the Hanacene Calendar
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-codex-parchment mb-6 leading-tight">
          The Chalesian<br />
          <span className="text-codex-gold">Codex</span>
        </h1>
        <p className="text-codex-parchmentDim text-lg max-w-xl mx-auto leading-relaxed">
          A lore compendium for the Hanacene Empire and the archipelago world of Chalesia.
          The empire fractures. Three banners rise. History is being written.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto" style={{ gridAutoRows: '1fr' }}>
        {FEATURED.map((item, i) => (
          <motion.div
            key={item.to}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * i }}
            className="flex"
          >
            <Link
              to={item.to}
              className="group flex flex-col w-full p-6 bg-codex-surface border border-codex-border rounded-lg hover:border-codex-gold transition-all duration-200 hover:bg-codex-surface/80"
            >
              <div className="text-2xl mb-3">{item.icon}</div>
              <h3 className="font-display text-codex-parchment text-lg group-hover:text-codex-gold transition-colors mb-1">
                {item.title}
              </h3>
              <p className="text-codex-parchmentDim text-sm leading-relaxed">{item.desc}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-codex-parchmentDim/70 text-sm font-display tracking-wider">
          Use the <span className="text-codex-gold">⚔ Your Character</span> button below to set your background and unlock hidden lore
        </p>
      </motion.div>
    </div>
  );
}
