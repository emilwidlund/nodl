import * as React from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './containers/App/App';

const root = createRoot(document.getElementById('root') || document.createElement('div'));

root.render(<App />);
