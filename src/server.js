const http = require('http');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/index.html': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getUsers': jsonHandler.getUsers,
    '/notReal': jsonHandler.notReal,
  },
  HEAD: {
    '/getUsers': jsonHandler.getUsersHead,
    '/notReal': jsonHandler.notRealHead,
  },
  POST: {
    '/addUser': jsonHandler.addUser,
  },
};

const parseBody = (request, response, handler) => {
  const body = [];

  request.on('error', (err) => {
    console.dir(err);
    response.statusCode = 400;
    response.end();
  });

  request.on('data', (chunk) => {
    body.push(chunk);
  });

  request.on('end', () => {
    const bodyString = Buffer.concat(body).toString();

    try {
      request.body = JSON.parse(bodyString);
    } catch (e) {
      request.body = query.parse(bodyString);
    }

    handler(request, response);
  });
};

const handlePost = (request, response, parsedUrl) => {
  if (parsedUrl.pathname === '/addUser') {
    parseBody(request, response, jsonHandler.addUser);
  } else {
    jsonHandler.notFound(request, response, 'POST');
  }
};

const handleGet = (request, response, parsedUrl) => {
  if (urlStruct.GET[parsedUrl.pathname]) {
    urlStruct.GET[parsedUrl.pathname](request, response);
  } else {
    jsonHandler.notFound(request, response, 'GET');
  }
};

const handleHead = (request, response, parsedUrl) => {
  if (urlStruct.HEAD[parsedUrl.pathname]) {
    urlStruct.HEAD[parsedUrl.pathname](request, response);
  } else {
    jsonHandler.notFoundHead(request, response);
  }
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);
  const method = request.method.toUpperCase();

  console.log(`${method} ${parsedUrl.pathname}`);

  switch (method) {
    case 'POST':
      handlePost(request, response, parsedUrl);
      break;
    case 'GET':
      handleGet(request, response, parsedUrl);
      break;
    case 'HEAD':
      handleHead(request, response, parsedUrl);
      break;
    default:
      jsonHandler.notFound(request, response, method);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
