import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Layout } from './components/layout/Layout';
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
import { NotFoundPage } from './pages/NotFoundPage';

function Root() {
  const { spec, updateSpec } = useCharacterSpec();
  const flags = getFlags(spec);

  return (
    <Layout spec={spec} onUpdateSpec={updateSpec}>
      <AnimatePresence mode="wait">
        <Outlet context={{ flags }} />
      </AnimatePresence>
    </Layout>
  );
}

function CityPageWrapper() {
  const { spec } = useCharacterSpec();
  return <CityPage flags={getFlags(spec)} />;
}
function FactionPageWrapper() {
  const { spec } = useCharacterSpec();
  return <FactionPage flags={getFlags(spec)} />;
}
function GodsPageWrapper() {
  const { spec } = useCharacterSpec();
  return <GodsPage flags={getFlags(spec)} />;
}
function CosmologyPageWrapper() {
  const { spec } = useCharacterSpec();
  return <CosmologyPage flags={getFlags(spec)} />;
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
      // Catch-all 404
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
