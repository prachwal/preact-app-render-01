import fastify from 'fastify';

const app = fastify({ logger: true });

app.get('/api/hello', async (request, reply) => {
  return { message: 'Hello from Render with Fastify!' };
});

const port = process.env.PORT || 3000;
app.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});