import { listAllPlans } from './services/stripe';

require('dotenv').config();

listAllPlans().then(data => {
  console.log(data);
});
