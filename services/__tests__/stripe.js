import Stripe from 'stripe';
import {
  createCustomer,
  createCard,
  createSubscription,
  listAllInvoices,
  listAllPlans,
  handleWebhook
} from '../stripe';

beforeEach(() => {
  process.env.STRIPE_SECRET_KEY = 'MOCK-KEY';
});

it('creates customer and returns a customer id', async () => {
  const id = await createCustomer({
    name: 'John',
    email: 'john@doe.com'
  });
  expect(Stripe.mocks.customers.create).toHaveBeenCalledWith({
    name: 'John',
    email: 'john@doe.com'
  });
  expect(id).toEqual(expect.stringContaining('cust_'));
});

it('updates customer with token', async () => {
  const resp = await createCard({
    token: 'cust_token',
    customerId: 'cust_123'
  });
  expect(Stripe.mocks.customers.update).toHaveBeenCalledWith(expect.stringContaining('cust_'), {
    source: 'cust_token'
  });
  expect(resp).toEqual({
    token: 'cust_token',
    customerId: expect.stringContaining('cust_')
  });
});

it('subscribes customer to a plan', async () => {
  const resp = await createSubscription({
    customerId: expect.stringContaining('cust_'),
    planId: 'annual_premium'
  });
  expect(Stripe.mocks.subscriptions.create).toHaveBeenCalledWith({
    customer: expect.stringContaining('cust_'),
    items: [{ plan: 'annual_premium' }]
  });
  expect(resp).toEqual({
    planId: 'annual_premium',
    customerId: expect.stringContaining('cust_')
  });
});

it('lists all invoices for a customer', async () => {
  const resp = await listAllInvoices({
    customerId: expect.stringContaining('cust_')
  });
  expect(Stripe.mocks.invoices.list).toHaveBeenCalledWith({
    customer: expect.stringContaining('cust_')
  });
  expect(resp).toEqual([
    {
      amount_due: 20,
      amount_paid: 20,
      invoice_pdf: 'https://stripe.com/invoice',
      status: 'paid',
      date: new Date(2018, 8, 8),
      period_start: new Date(2018, 8, 8),
      period_end: new Date(2018, 9, 8)
    }
  ]);
});

it('lists all plans', async () => {
  const resp = await listAllPlans();
  expect(Stripe.mocks.plans.list).toHaveBeenCalledTimes(1);
  expect(resp).toEqual([
    {
      id: 'plan_EwhdWAyl20lY3r',
      title: 'Agency - Monthly',
      description: '10 projects, unlimited API calls',
      amount: 6000,
      currency: 'aud',
      interval: 'month'
    },
    {
      id: 'plan_EwhcP2qanL2la9',
      title: 'Freelancer - Monthly',
      description: '3 projects, unlimited API calls',
      amount: 3000,
      currency: 'aud',
      interval: 'month'
    },
    {
      id: 'plan_EwhcFkDkq3Wfzr',
      title: 'Free - Monthly',
      description: '1 project, 500 API calls per day',
      amount: 0,
      currency: 'aud',
      interval: 'month'
    }
  ]);
});

const mockData = {
  object: {
    customer: 'cust_123',
    current_period_end: '08/09/18',
    current_period_start: '08/08/18'
  }
};

const mockRes = {
  sendStatus: jest.fn()
};

const mockHandleUpdated = jest.fn();

it('runs callback on customer subscription deleted webhook', () => {
  const mockReq = {
    body: JSON.stringify({
      type: 'customer.subscription.deleted',
      data: mockData
    })
  };

  handleWebhook({
    req: mockReq,
    res: mockRes,
    handleSubscriptionUpdated: mockHandleUpdated
  });

  expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
  expect(mockHandleUpdated).toHaveBeenCalledWith({
    customerId: mockData.object.customer,
    periodStart: mockData.object.current_period_start,
    periodEnd: mockData.object.current_period_end
  });
});

it('runs callback on customer subscription created webhook', () => {
  const mockReq = {
    body: JSON.stringify({
      type: 'customer.subscription.created',
      data: mockData
    })
  };

  handleWebhook({
    req: mockReq,
    res: mockRes,
    handleSubscriptionUpdated: mockHandleUpdated
  });

  expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
  expect(mockHandleUpdated).toHaveBeenCalledWith({
    customerId: mockData.object.customer,
    periodStart: mockData.object.current_period_start,
    periodEnd: mockData.object.current_period_end
  });
});

it('runs callback on customer subscription updated webhook', () => {
  const mockReq = {
    body: JSON.stringify({
      type: 'customer.subscription.updated',
      data: mockData
    })
  };

  handleWebhook({
    req: mockReq,
    res: mockRes,
    handleSubscriptionUpdated: mockHandleUpdated
  });

  expect(mockRes.sendStatus).toHaveBeenCalledWith(200);
  expect(mockHandleUpdated).toHaveBeenCalledWith({
    customerId: mockData.object.customer,
    periodStart: mockData.object.current_period_start,
    periodEnd: mockData.object.current_period_end
  });
});
