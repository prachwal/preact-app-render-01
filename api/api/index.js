const fastify = require('fastify')({ logger: true });

fastify.get('/api/hello', async (request, reply) => {
  return { message: 'Hello from Render with Fastify!' };
});

const port = process.env.PORT || 3000;
fastify.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening on ${address}`);
});
