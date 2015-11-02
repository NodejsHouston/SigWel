
exports.register = function (server, options, next) {
  server.ext('onRequest', function (request, reply) {
    if (request.headers['x-forwarded-proto'] === 'http') {
      console.log("preRequest");
      return reply()
        .redirect('http://' + request.headers.host + request.url.path)
        .code(301);
    }
    reply.continue();
  });
  next();
};

exports.register.attributes = {
    name: 'preRequest'
};