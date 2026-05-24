import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * The Hanacene calendar — twelve 28-day months named for alchemical metals,
 * with a week-long feast at the head of each season and a single Day of
 * Darkness closing the year. Sourced from `Calendar and Time.md` in the
 * Sync vault.
 *
 * Total: 12 × 28 = 336 month-days + 4 × 7 feast-days + 1 Day of Darkness
 *      = 365 days/year.
 *
 * Lunar period is 28 days flat, so the moon phase is locked to month
 * position and advances by a quarter-cycle each month.
 */

interface Month {
  name: string;
  metal: string;
  blurb: string;
}

interface Season {
  id: 'winter' | 'spring' | 'summer' | 'fall';
  name: string;
  // The shared accent colour for the season's UI tint.
  color: string;
  // Feast opens the season; first day is the solstice/equinox.
  feast: {
    name: string;
    opener: string; // "solstice" / "equinox"
    godId: string;  // anchor in /gods page
    godName: string;
    domain: string;
  };
  months: Month[];
}

const SEASONS: Season[] = [
  {
    id: 'winter',
    name: 'Winter',
    color: '#a8c8e0',
    feast: {
      name: 'Winter Feast',
      opener: 'winter solstice',
      godId: 'syltea',
      godName: 'Syltea',
      domain: 'moon, sea, and commerce',
    },
    months: [
      { name: 'Argent',  metal: 'silver',  blurb: 'The frost begins. Winter has not set in fully yet.' },
      { name: 'Stagnis', metal: 'tin',     blurb: 'The cold deepens; nights lengthen.' },
      { name: 'Plume',   metal: 'lead',    blurb: 'The darkest and heaviest month.' },
    ],
  },
  {
    id: 'spring',
    name: 'Spring',
    color: '#92e0a4',
    feast: {
      name: 'Spring Feast',
      opener: 'spring equinox',
      godId: 'myrai',
      godName: 'Myrai',
      domain: 'life; the natural world',
    },
    months: [
      { name: 'Azoth',   metal: 'mercury / quicksilver', blurb: 'The snowmelt begins.' },
      { name: 'Bismite', metal: 'bismuth',               blurb: 'The iridescent bloom.' },
      { name: 'Cadmia',  metal: 'zinc',                  blurb: 'Late spring; the land greens fully.' },
    ],
  },
  {
    id: 'summer',
    name: 'Summer',
    color: '#e8c96a',
    feast: {
      name: 'Summer Feast',
      opener: 'summer solstice',
      godId: 'iriyal',
      godName: 'Iriyal',
      domain: 'the sun, sky, and seasons',
    },
    months: [
      { name: 'Aurum',   metal: 'gold',                       blurb: 'High summer. Long days.' },
      { name: 'Pyrite',  metal: 'sulfur',                     blurb: 'The heat of midsummer.' },
      { name: 'Realgos', metal: 'realgar (arsenic ore)',      blurb: 'Red, hot, and the leaves begin to turn.' },
    ],
  },
  {
    id: 'fall',
    name: 'Fall',
    color: '#d08a4a',
    feast: {
      name: 'Harvest Feast',
      opener: 'fall equinox',
      godId: 'alreth',
      godName: 'Alreth',
      domain: 'civilization and the harvest',
    },
    months: [
      { name: 'Kypris', metal: 'copper',                    blurb: 'Named for the colour of the falling leaves.' },
      { name: 'Ferros', metal: 'iron',                      blurb: 'The harvest.' },
      { name: 'Kohlos', metal: 'antimony, in the form of kohl', blurb: 'The year draws down toward darkness.' },
    ],
  },
];

// In-world current date — surface this prominently so DM and players can
// orient themselves at a glance.
const CURRENT_DATE = '398 HC';

export function CalendarPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-10 px-4 max-w-4xl mx-auto"
    >
      <h1 className="font-display text-4xl text-codex-parchment mb-2">The Calendar</h1>
      <p className="text-codex-parchmentDim mb-6">
        The Hanacene year — twelve months named for the alchemical metals, four seasonal feasts,
        and the long shadow of the Day of Darkness.
      </p>

      {/* Current-date callout */}
      <div className="mb-10 p-5 border border-codex-gold/40 rounded-lg bg-codex-gold/5">
        <div className="font-display text-xs text-codex-parchmentDim uppercase tracking-widest mb-1">
          Current Year
        </div>
        <div className="font-display text-2xl text-codex-gold">{CURRENT_DATE}</div>
        <p className="text-codex-parchmentDim text-sm mt-2 italic">
          The Hanacene Calendar (HC) is dated from the founding of the Second Empire.
          Its use across the eastern archipelago is a soft expression of imperial cultural reach.
        </p>
      </div>

      {/* Structural facts */}
      <section className="mb-10">
        <h2 className="font-display text-2xl text-codex-gold mb-4">How the Year Is Reckoned</h2>
        <ul className="space-y-2 text-codex-parchment leading-relaxed list-disc list-inside marker:text-codex-gold">
          <li>
            <span className="text-codex-parchment">Twelve months of <strong>28 days</strong> each</span>
            <span className="text-codex-parchmentDim"> — 336 day-counted days in all, divided into 7-day weeks.</span>
          </li>
          <li>
            <span className="text-codex-parchment">Each season opens with a <strong>week-long feast</strong></span>
            <span className="text-codex-parchmentDim"> beginning on the solstice or equinox. These 28 feast days fall outside the month-count.</span>
          </li>
          <li>
            <span className="text-codex-parchment">The year ends with the <strong>Day of Darkness</strong></span>
            <span className="text-codex-parchmentDim"> — a single unlucky day before the winter solstice, also outside the months.</span>
          </li>
          <li>
            <span className="text-codex-parchment">The lunar period is exactly <strong>28 days</strong></span>
            <span className="text-codex-parchmentDim">, so the moon's phase is locked to the day of the month and advances by a quarter-cycle each month.</span>
          </li>
        </ul>
      </section>

      {/* Seasons */}
      <div className="space-y-8">
        {SEASONS.map((season, i) => (
          <motion.section
            key={season.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + i * 0.05 }}
            className="border border-codex-border rounded-lg overflow-hidden"
            style={{ borderColor: season.color + '55' }}
          >
            {/* Season header */}
            <header
              className="px-5 py-4 border-b"
              style={{
                backgroundColor: season.color + '11',
                borderColor: season.color + '33',
              }}
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <h2 className="font-display text-2xl" style={{ color: season.color }}>
                  {season.name}
                </h2>
                <div className="text-sm text-codex-parchmentDim">
                  Opens on the <span className="text-codex-parchment">{season.feast.opener}</span>
                  {' · '}
                  <span className="text-codex-parchment">{season.feast.name}</span>
                </div>
              </div>
              <p className="text-sm text-codex-parchmentDim mt-1 italic">
                Patron of the season:{' '}
                <Link
                  to={`/gods#${season.feast.godId}`}
                  className="text-codex-parchment hover:text-codex-gold underline-offset-2 hover:underline transition-colors"
                >
                  {season.feast.godName}
                </Link>
                <span> — {season.feast.domain}.</span>
              </p>
            </header>

            {/* Months — three columns side-by-side, in calendar order. On
                narrow screens they stack so nothing overflows. */}
            <ol className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-codex-border/60">
              {season.months.map((month, mi) => {
                // Absolute month number across the whole year (1-12).
                const absIndex = SEASONS
                  .slice(0, i)
                  .reduce((acc, s) => acc + s.months.length, 0) + mi + 1;
                return (
                  <li key={month.name} className="px-5 py-4">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span
                        className="font-display text-sm flex-shrink-0"
                        style={{ color: season.color }}
                      >
                        {absIndex}.
                      </span>
                      <span className="font-display text-lg text-codex-parchment">{month.name}</span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </motion.section>
        ))}
      </div>

      {/* Day of Darkness footer */}
      <section className="mt-10 p-5 border border-codex-border rounded-lg bg-codex-void/60">
        <h2 className="font-display text-2xl mb-3" style={{ color: '#7a6a8a' }}>
          The Day of Darkness
        </h2>
        <p className="text-codex-parchment leading-relaxed mb-3">
          The final day of the year — falling between the end of Kohlos and the winter solstice —
          belongs to no month and no season. It is the unluckiest day on the calendar. Travel is
          avoided, contracts are not signed, children born on it are quietly considered marked. The
          following morning the winter solstice arrives, and with it the bombastic opening of the
          Winter Feast, designed in equal measure to celebrate the year's turn and to drive away
          whatever the dark day left behind.
        </p>
        <p className="text-codex-parchmentDim text-sm italic">
          336 month-days + 28 feast days + 1 Day of Darkness = 365 days in the Hanacene year.
        </p>
      </section>
    </motion.div>
  );
}
