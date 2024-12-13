process.env.JWT_SECRET = 'test_secret';

const request = require('supertest');
const Todo = require('../models/todo');
const app = require('../app');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Mocking the Todo model
jest.mock('../models/todo');

// Mocking the logger
jest.mock('../utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

const testUser = { id: 1, email: 'test@example.com' };
const token = jwt.sign(testUser, process.env.JWT_SECRET, { expiresIn: '1h' });

describe('Todo API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const createMockTodo = (id = 1) => ({
    id,
    title: `Test Todo ${id}`,
    description: `Description ${id}`,
    isCompleted: false,
    createdAt: new Date().toISOString(),
    userId: testUser.id,
    update: jest.fn().mockImplementation(function (data) {
      Object.assign(this, data);
      return Promise.resolve(this);
    }),
    destroy: jest.fn().mockResolvedValue(),
    toJSON: function () {
      return {
        id: this.id,
        title: this.title,
        description: this.description,
        isCompleted: this.isCompleted,
        createdAt: this.createdAt,
        userId: this.userId,
      };
    },
  });

  describe('POST /api/todos', () => {
    it('Action: create a new todo', async () => {
      const newTodo = { title: 'Test Todo 1', description: 'Description 1' };
      const createdTodo = createMockTodo(1);
      Todo.create.mockResolvedValue(createdTodo);
      const res = await request(app)
        .post('/api/todos')
        .set('Cookie', [`token=${token}`])
        .send(newTodo);
      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(createdTodo.toJSON());
      expect(Todo.create).toHaveBeenCalledWith(expect.objectContaining({
        ...newTodo,
        userId: testUser.id,
      }));
    });

    it('Action: return 400', async () => {
      const invalidTodo = { title: '' };
      const res = await request(app)
        .post('/api/todos')
        .set('Cookie', [`token=${token}`])
        .send(invalidTodo);

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('GET /api/todos', () => {
    it('Action: get list of todos', async () => {
      const todos = [createMockTodo(1), createMockTodo(2)];
      Todo.findAndCountAll.mockResolvedValue({
        count: todos.length,
        rows: todos,
      });
      const res = await request(app).get('/api/todos').set('Cookie', [`token=${token}`]);;
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('total', todos.length);
      expect(res.body).toHaveProperty('data');
    });

    it('Action: return 500', async () => {
      Todo.findAndCountAll.mockRejectedValue(new Error('Database does not exist'));
      const res = await request(app).get('/api/todos').set('Cookie', [`token=${token}`]);
      expect(res.statusCode).toEqual(500);
      expect(res.body).toHaveProperty('message', 'Database does not exist');
      expect(res.body).toHaveProperty('status', 'error');
      expect(res.body).toHaveProperty('statusCode', 500);
    });
  });

  describe('GET /api/todos/:id', () => {
    it('Action: get todo by id', async () => {
      const todos = createMockTodo(1);
      Todo.findOne.mockResolvedValue(todos);
      const res = await request(app)
        .get('/api/todos/1')
        .set('Cookie', [`token=${token}`]);
      expect(Todo.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: testUser.id,
        },
      });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(todos.toJSON());
    });

    it('Action: return 404', async () => {
      Todo.findOne.mockResolvedValue(null);
      const res = await request(app)
        .get('/api/todos/1')
        .set('Cookie', [`token=${token}`]);
      expect(Todo.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: testUser.id,
        },
      });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Todo not found');
    });

  });

  describe('PUT /api/todos/:id', () => {
    it('Action:  update a todo', async () => {
      const updatedData = { title: 'Updated Todo', description: 'Updated Description', isCompleted: true };
      const todo = createMockTodo(1);
      Todo.findOne.mockResolvedValue(todo);
      const res = await request(app)
        .put('/api/todos/1')
        .set('Cookie', [`token=${token}`])
        .send(updatedData);
      expect(Todo.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: testUser.id,
        },
      });
      expect(todo.update).toHaveBeenCalledWith(expect.objectContaining(updatedData));
      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        id: 1,
        title: 'Updated Todo',
        description: 'Updated Description',
        isCompleted: true,
        createdAt: todo.createdAt,
        userId: testUser.id,
      });
    });

    it('Action: return 404 Todo not found', async () => {
      Todo.findOne.mockResolvedValue(null);
      const res = await request(app)
        .put('/api/todos/1')
        .set('Cookie', [`token=${token}`])
        .send({ "isCompleted": true, title: 'Updated Todo', description: 'Updated Description' });
      expect(Todo.findOne).toHaveBeenCalledWith({
        where: {
          id: '1',
          userId: testUser.id,
        },
      });
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Todo not found');
    });

    it('Action: return 400 validation failed', async () => {
      const invalidData = { title: '' };
      const res = await request(app)
        .put('/api/todos/1')
        .set('Cookie', [`token=${token}`])
        .send(invalidData);
      expect(Todo.findOne).not.toHaveBeenCalled();
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    it('Action:  delete a todo', async () => {
      const todo = createMockTodo(1);
      todo.destroy = jest.fn().mockResolvedValue();
      Todo.findOne.mockResolvedValue(todo);
      const res = await request(app)
        .delete('/api/todos/1')
        .set('Cookie', [`token=${token}`]);
      expect(res.statusCode).toEqual(200);
      expect(todo.destroy).toHaveBeenCalled();
      expect(res.body).toHaveProperty('message', 'Todo deleted');
    });

    it('Action: return 404 if todo not found', async () => {
      Todo.findOne.mockResolvedValue(null);
      const res = await request(app)
        .delete('/api/todos/1')
        .set('Cookie', [`token=${token}`]);
      expect(res.statusCode).toEqual(404);
      expect(res.body).toHaveProperty('error', 'Todo not found');
    });
  });
});


