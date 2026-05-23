import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CharacterSpec, Species, Background, Region, Faction, KnowledgeSkill } from '../types';

interface Props {
  spec: CharacterSpec;
  onUpdate: (updates: Partial<CharacterSpec>) => void;
}

const SPECIES_OPTIONS: { value: Species; label: string }[] = [
  { value: 'human', label: 'Human' },
  { value: 'elf', label: 'Elf' },
  { value: 'half-dragon', label: 'Half-Dragon' },
  { value: 'orc', label: 'Orc' },
  { value: 'dwarf', label: 'Dwarf' },
  { value: 'goblinoid', label: 'Goblinoid' },
  { value: 'other', label: 'Other' },
];

const BACKGROUND_OPTIONS: { value: Background; label: string }[] = [
  { value: 'noble', label: 'Noble' },
  { value: 'soldier', label: 'Soldier' },
  { value: 'merchant', label: 'Merchant' },
  { value: 'scholar', label: 'Scholar' },
  { value: 'priest', label: 'Priest' },
  { value: 'acolyte', label: 'Acolyte' },
  { value: 'hermit', label: 'Hermit' },
  { value: 'spy', label: 'Spy / Agent' },
  { value: 'criminal', label: 'Criminal' },
  { value: 'sailor', label: 'Sailor' },
  { value: 'skyknight', label: 'Skyknight' },
  { value: 'commoner', label: 'Commoner' },
];

const REGION_OPTIONS: { value: Region; label: string }[] = [
  { value: 'thyalix', label: 'Thyalix (Hanach)' },
  { value: 'ylanthitar', label: "Y'lanthitar (Eorvar)" },
  { value: 'aurem', label: 'Aurem (Melonar)' },
  { value: 'enester', label: 'Enester (Zorlatra)' },
  { value: 'imikiv', label: 'Imikiv (Pelath)' },
  { value: 'chilix', label: 'Chilix (Kleover)' },
  { value: 'irdagar', label: 'Irdagar' },
  { value: 'ilthyrion', label: 'Ilthyrion' },
  { value: 'skeinland', label: 'Skeinland' },
  { value: 'free-cities', label: 'Free Cities' },
  { value: 'elven-east', label: 'Eastern Islands (Elven)' },
  { value: 'legia', label: 'Legia (Legian Empire)' },
  { value: 'unknown', label: 'Unknown / Foreign' },
];

const FACTION_OPTIONS: { value: Faction; label: string }[] = [
  { value: 'chalexis', label: 'Chalexis (Imperial)' },
  { value: 'iaryx', label: 'Iaryx (Reform)' },
  { value: 'halkir', label: 'Halkir (Restoration)' },
  { value: 'neutral', label: 'Neutral / Unaligned' },
  { value: 'free', label: 'Free Cities' },
  { value: 'foreign', label: 'Foreign Power' },
];

const SKILL_OPTIONS: { value: KnowledgeSkill; label: string }[] = [
  { value: 'history', label: 'History' },
  { value: 'religion', label: 'Religion' },
  { value: 'arcana', label: 'Arcana' },
  { value: 'nature', label: 'Nature' },
  { value: 'investigation', label: 'Investigation' },
  { value: 'insight', label: 'Insight' },
];

export function CharacterSpecPanel({ spec, onUpdate }: Props) {
  const [open, setOpen] = useState(false);

  function toggleSkill(skill: KnowledgeSkill) {
    const next = spec.skills.includes(skill)
      ? spec.skills.filter(s => s !== skill)
      : [...spec.skills, skill];
    onUpdate({ skills: next });
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-codex-surface border border-codex-gold text-codex-gold font-display text-sm px-4 py-2 rounded-full shadow-lg hover:bg-codex-gold hover:text-codex-void transition-colors duration-200"
      >
        <span>{open ? '✕ Close' : '⚔ Your Character'}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-12 right-0 w-80 bg-codex-dark border border-codex-border rounded-lg shadow-2xl p-4 space-y-4"
          >
            <h3 className="font-display text-codex-gold text-base">Character Specification</h3>
            <p className="text-codex-parchmentDim text-xs leading-relaxed">
              This controls what information is visible to you. Some lore is hidden without the right background or training. (Honor system — no enforcement.)
            </p>

            <div>
              <label className="block text-xs text-codex-parchmentDim mb-1">Name (optional)</label>
              <input
                type="text"
                value={spec.name}
                onChange={e => onUpdate({ name: e.target.value })}
                placeholder="Your character's name..."
                className="w-full bg-codex-surface border border-codex-border rounded px-2 py-1.5 text-codex-parchment text-sm focus:border-codex-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-codex-parchmentDim mb-1">Species</label>
              <select
                value={spec.species}
                onChange={e => onUpdate({ species: e.target.value as Species })}
                className="w-full bg-codex-surface border border-codex-border rounded px-2 py-1.5 text-codex-parchment text-sm focus:border-codex-gold focus:outline-none"
              >
                {SPECIES_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-codex-parchmentDim mb-1">Background</label>
              <select
                value={spec.background}
                onChange={e => onUpdate({ background: e.target.value as Background })}
                className="w-full bg-codex-surface border border-codex-border rounded px-2 py-1.5 text-codex-parchment text-sm focus:border-codex-gold focus:outline-none"
              >
                {BACKGROUND_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-codex-parchmentDim mb-1">Home Region</label>
              <select
                value={spec.region}
                onChange={e => onUpdate({ region: e.target.value as Region })}
                className="w-full bg-codex-surface border border-codex-border rounded px-2 py-1.5 text-codex-parchment text-sm focus:border-codex-gold focus:outline-none"
              >
                {REGION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-codex-parchmentDim mb-1">Faction Allegiance</label>
              <select
                value={spec.faction}
                onChange={e => onUpdate({ faction: e.target.value as Faction })}
                className="w-full bg-codex-surface border border-codex-border rounded px-2 py-1.5 text-codex-parchment text-sm focus:border-codex-gold focus:outline-none"
              >
                {FACTION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs text-codex-parchmentDim mb-2">Knowledge Skills (trained)</label>
              <div className="flex flex-wrap gap-2">
                {SKILL_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    onClick={() => toggleSkill(o.value)}
                    className={`px-2 py-1 text-xs rounded border transition-colors duration-150 ${
                      spec.skills.includes(o.value)
                        ? 'bg-codex-gold text-codex-void border-codex-gold'
                        : 'bg-transparent text-codex-parchmentDim border-codex-border hover:border-codex-gold hover:text-codex-parchment'
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
