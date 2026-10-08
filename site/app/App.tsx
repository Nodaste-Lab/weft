import { HtmlDocumentComponents } from './pages/HtmlDocumentComponents';
import React from 'react';
import { Layout } from './Layout';
import { useRoute } from './routes';
import { AllGalleryPage } from './pages/AllGalleryPage';
import { ComponentPage } from './pages/ComponentPage';
import { GuidelinesPage } from './pages/GuidelinesPage';
import { HomePage } from './pages/HomePage';
import { PatternPage } from './pages/PatternPage';
import { TemplatePage } from './pages/TemplatePage';
import { InputLab } from './pages/InputLab';
import { SettingsLab } from './pages/SettingsLab';
import { NavigationRailLab } from './pages/NavigationRailLab';
import { TokensPage } from './pages/TokensPage';

export function App() {
  const route = useRoute();
  let page: React.ReactNode;
  switch (route.section) {
    case 'guidelines':
      page = <GuidelinesPage id={route.id} />;
      break;
    case 'tokens':
      page = <TokensPage id={route.id} />;
      break;
    case 'components':
      page = <ComponentPage id={route.id} />;
      break;
    case 'patterns':
      page = <PatternPage id={route.id} />;
      break;
    case 'templates':
      page = route.id === 'settings' || route.id?.startsWith('settings/') ? <SettingsLab path={route.id} /> : <TemplatePage id={route.id} />;
      break;
    case 'labs':
      page = route.id === 'html-documents' ? <HtmlDocumentComponents /> : route.id === 'inputs' ? <InputLab /> : (route.id === 'settings' || route.id?.startsWith('settings/')) ? <SettingsLab path={route.id} /> : route.id === 'navigation-rail' ? <NavigationRailLab initialLevel={route.level} /> : <div><h1>{route.id ? 'Lab not found' : 'Labs'}</h1><a href="#/labs/navigation-rail">Navigation rail lab</a></div>;
      break;
    case 'all':
      // Full width, no rail: the visual baselines capture the one-page gallery
      // at this geometry, so the reference route keeps it.
      return <AllGalleryPage />;
    default:
      page = <HomePage />;
  }
  return <Layout route={route}>{page}</Layout>;
}
