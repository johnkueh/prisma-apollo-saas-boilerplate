import { app } from './app';

app.listen({ port: process.env.EXPRESS_PORT }, () => {
  console.log(`Apollo Server on http://localhost:${process.env.EXPRESS_PORT}/graphql`);
});
