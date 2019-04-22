import analyticsDirective from './analytics';
import computedDirective from './computed';
import requireAuthDirective from './require-auth';
import validateDirective from './validate';

export default {
  requireAuth: requireAuthDirective,
  computed: computedDirective,
  validate: validateDirective,
  analytics: analyticsDirective,
  analytics_group: analyticsDirective
};
