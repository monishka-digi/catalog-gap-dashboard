import { normalizeDashboardPayload } from './src/features/catalog-dashboard/api/dashboardApi.js';
import { fallbackDashboardPayload } from './src/features/catalog-dashboard/data/catalogDashboardData.js';

try {
  const normalized = normalizeDashboardPayload(fallbackDashboardPayload);
  console.log(JSON.stringify(normalized.suggestions.map(s => ({
    sku: s.sku,
    name: s.name,
    oldDesc: s.oldDesc,
    newDesc: s.newDesc,
    old_description: s.old_description,
    revised_description: s.revised_description
  })), null, 2));
} catch (err) {
  console.error('Normalization error:', err);
  process.exit(1);
}
