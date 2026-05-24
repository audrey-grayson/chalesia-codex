import { createHashRouter, RouterProvider, Outlet, useOutletContext } from 'react-router-dom';
import type { ContentFlag } from './types';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
import { ScrollToTop } from './components/ScrollToTop';
import { useCharacterSpec } from './hooks/useCharacterSpec';
import { getFlags } from './data/flags';
import { HomePage } from './pages/Home';
import { MapPage } from './pages/MapPage';
import { CitiesPage } from './pages/CitiesPage';
import { CityPage } from './pages/CityPage';
import { FactionsPage } from './pages/FactionsPage';
import { FactionPage } from './pages/FactionPage';
import { GodsPage } from './pages/GodsPage';
import { CosmologyPage } from './pages/CosmologyPage';
import { CalendarPage } from './pages/CalendarPage';
import { NotFoundPage } from './pages/NotFoundPage';

function Root() {
  const { spec, updateSpec } = useCharacterSpec();
  const flags = getFlags(spec);

  return (
    <Layout spec={spec} onUpdateSpec={updateSpec}>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Outlet context={{ flags }} />
      </AnimatePresence>
    </Layout>
  );
}

/**
 * Page wrappers read `flags` from the Outlet context provided by <Root />.
 *
 * Previously each wrapper called useCharacterSpec() independently, which
 * created a separate useState instance per wrapper. When the user updated
 * their character via the Layout (which uses Root's instance), only Root's
 * state changed — the wrappers' independent states kept their stale
 * localStorage-seeded values until full remount. Reading from the Outlet
 * context ensures a single source of truth: Root recomputes flags from its
 * own spec on every change, and every gated page sees the new flags
 * immediately.
 */
type OutletCtx = { flags: Set<ContentFlag> };

function CityPageWrapper() {
  const { flags } = useOutletContext<OutletCtx>();
  return <CityPage flags={flags} />;
}
function FactionPageWrapper() {
  const { flags } = useOutletContext<OutletCtx>();
  return <FactionPage flags={flags} />;
}
function GodsPageWrapper() {
  const { flags } = useOutletContext<OutletCtx>();
  return <GodsPage flags={flags} />;
}
function CosmologyPageWrapper() {
  const { flags } = useOutletContext<OutletCtx>();
  return <CosmologyPage flags={flags} />;
}

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'cities', element: <CitiesPage /> },
      { path: 'cities/:id', element: <CityPageWrapper /> },
      { path: 'factions', element: <FactionsPage /> },
      { path: 'factions/:id', element: <FactionPageWrapper /> },
      { path: 'gods', element: <GodsPageWrapper /> },
      { path: 'cosmology', element: <CosmologyPageWrapper /> },
      { path: 'calendar', element: <CalendarPage /> },
      // Catch-all 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
