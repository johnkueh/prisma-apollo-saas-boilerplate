import bcrypt from 'bcrypt';

export default async ({ id = 1, email = 'test@user.com', password = 'testpassword' }) => ({
  id,
  firstName: 'Test',
  lastName: 'User',
  email,
  createdAt: new Date(1988, 2, 2),
  updatedAt: new Date(1988, 2, 3),
  periodStart: new Date(1988, 10, 10),
  periodEnd: new Date(1988, 10, 11),
  password: await bcrypt.hash(password, 10),
  team: {
    id: 1,
    name: 'A team name'
  }
});
