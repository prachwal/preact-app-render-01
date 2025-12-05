import fastify from 'fastify';

const app = fastify({ logger: true });

app.get('/api/hello', async (request, reply) => {
  return { message: 'Hello from Render with Fastify!' };
});

app.post('/api/base64/encode', async (request, reply) => {
  try {
    const { text } = request.body;

    // Validate input
    if (!text || typeof text !== 'string') {
      return reply.code(400).send({
        error: 'Invalid input: expected JSON with "text" field containing a string'
      });
    }

    // Encode to base64
    const base64 = Buffer.from(text, 'utf8').toString('base64');

    return { base64 };
  } catch (error) {
    app.log.error('Base64 encoding error:', error);
    return reply.code(500).send({
      error: 'Internal server error during base64 encoding'
    });
  }
});

const port = process.env.PORT || 3000;
app.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`Server listening on ${address}`);
});
