const users = [];

const badRequest = (request, response, message, id) => {
  const responseJSON = {
    message,
    id,
  };

  response.writeHead(400, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(responseJSON));
  response.end();
};

const getUsers = (request, response) => {
  const responseJSON = {
    message: 'Users retrieved successfully',
    users,
  };

  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(responseJSON));
  response.end();
};

const getUsersHead = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
};

const addUser = (request, response) => {
  const userData = request.body;

  if (!userData.name && !userData.age) {
    return badRequest(request, response, 'Name and age are required', 'MISSING_BOTH_FIELDS');
  }

  if (!userData.name) {
    return badRequest(request, response, 'Name is required', 'MISSING_NAME');
  }

  if (!userData.age) {
    return badRequest(request, response, 'Age is required', 'MISSING_AGE');
  }

  const age = parseInt(userData.age, 10);

  const existingUserIndex = users.findIndex((user) => user.name === userData.name);

  if (existingUserIndex !== -1) {
    users[existingUserIndex].age = age;
    response.writeHead(204);
    response.end();
  } else {
    const newUser = {
      name: userData.name,
      age,
    };
    users.push(newUser);

    const responseJSON = {
      message: 'Created Successfully',
      user: newUser,
    };

    response.writeHead(201, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(responseJSON));
    response.end();
  }
  return 0;
};

const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  response.writeHead(404, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(responseJSON));
  response.end();
};

const notRealHead = (request, response) => {
  response.writeHead(404);
  response.end();
};

const notFound = (request, response, method) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  response.writeHead(404, { 'Content-Type': 'application/json' });

  if (method === 'HEAD') {
    response.end();
  } else {
    response.write(JSON.stringify(responseJSON));
    response.end();
  }
};

const notFoundHead = (request, response) => {
  response.writeHead(404);
  response.end();
};

module.exports = {
  getUsers,
  getUsersHead,
  addUser,
  notReal,
  notRealHead,
  notFound,
  notFoundHead,
  badRequest,
};
