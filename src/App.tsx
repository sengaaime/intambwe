/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Layout } from './components/Layout';
import { DailyImihigo } from './components/DailyImihigo';
import { IntambweTracker } from './components/IntambweTracker';
import { FocusHill } from './components/FocusHill';

export default function App() {
  return (
    <Layout>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <IntambweTracker />
        </div>
        <div className="md:col-span-1">
          <DailyImihigo />
        </div>
        <div className="md:col-span-1">
          <FocusHill />
        </div>
      </div>
    </Layout>
  );
}
