import analyticsDirective from './analytics';
import computedDirective from './computed';
import requireAuthDirective from './require-auth';

export default {
  requireAuth: requireAuthDirective,
  computed: computedDirective,
  analytics: analyticsDirective,
  analytics_group: analyticsDirective
};
