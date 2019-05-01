import dotenv from 'dotenv';

dotenv.config();
const { app } = require('./app');

app.listen({ port: process.env.EXPRESS_PORT }, () => {
  console.log(`Apollo Server on http://localhost:${process.env.EXPRESS_PORT}/graphql`);
});
