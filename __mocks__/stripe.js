const Stripe = jest.genMockFromModule('stripe');

Stripe.mocks = {
  customers: {
    create: jest.fn().mockImplementation(({ email }) =>
      Promise.resolve({
        id: `cust_${email}`
      })
    ),
    update: jest.fn().mockImplementation((customerId, { source: token }) =>
      Promise.resolve({
        token,
        customerId
      })
    )
  },
  subscriptions: {
    create: jest.fn().mockResolvedValue({
      planId: 'annual_premium',
      customerId: 'cust_234'
    })
  },
  invoices: {
    list: jest.fn().mockResolvedValue({
      data: [
        {
          amount_due: 20,
          amount_paid: 20,
          invoice_pdf: 'https://stripe.com/invoice',
          status: 'paid',
          date: new Date(2018, 8, 8),
          period_start: new Date(2018, 8, 8),
          period_end: new Date(2018, 9, 8)
        }
      ]
    })
  },
  plans: {
    list: jest.fn().mockResolvedValue({
      data: [
        {
          id: 'plan_EwhdWAyl20lY3r',
          object: 'plan',
          active: true,
          aggregate_usage: null,
          amount: 6000,
          billing_scheme: 'per_unit',
          created: 1556124330,
          currency: 'aud',
          interval: 'month',
          interval_count: 1,
          livemode: false,
          metadata: { description: '10 projects, unlimited API calls' },
          nickname: 'Agency - Monthly',
          product: 'prod_Ewhbu2lvDV6qA3',
          tiers: null,
          tiers_mode: null,
          transform_usage: null,
          trial_period_days: 14,
          usage_type: 'licensed'
        },
        {
          id: 'plan_EwhcP2qanL2la9',
          object: 'plan',
          active: true,
          aggregate_usage: null,
          amount: 3000,
          billing_scheme: 'per_unit',
          created: 1556124312,
          currency: 'aud',
          interval: 'month',
          interval_count: 1,
          livemode: false,
          metadata: { description: '3 projects, unlimited API calls' },
          nickname: 'Freelancer - Monthly',
          product: 'prod_Ewhbu2lvDV6qA3',
          tiers: null,
          tiers_mode: null,
          transform_usage: null,
          trial_period_days: 14,
          usage_type: 'licensed'
        },
        {
          id: 'plan_EwhcFkDkq3Wfzr',
          object: 'plan',
          active: true,
          aggregate_usage: null,
          amount: 0,
          billing_scheme: 'per_unit',
          created: 1556124276,
          currency: 'aud',
          interval: 'month',
          interval_count: 1,
          livemode: false,
          metadata: { description: '1 project, 500 API calls per day' },
          nickname: 'Free - Monthly',
          product: 'prod_Ewhbu2lvDV6qA3',
          tiers: null,
          tiers_mode: null,
          transform_usage: null,
          trial_period_days: 14,
          usage_type: 'licensed'
        }
      ]
    })
  }
};

Stripe.mockImplementation(() => Stripe.mocks);

export default Stripe;
