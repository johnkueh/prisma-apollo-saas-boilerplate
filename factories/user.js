export default ({ id }) => ({
  id,
  firstName: 'John',
  lastName: 'Kueh',
  email: 'john@beaconmaker.com',
  createdAt: new Date(1988, 2, 2),
  updatedAt: new Date(1988, 2, 3),
  periodStart: new Date(1988, 10, 10),
  periodEnd: new Date(1988, 10, 11),
  team: {
    id: 1,
    name: 'A team name'
  }
});
