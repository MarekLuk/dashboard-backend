const express = require("express");
const Joi = require('joi');
const Todo = require("../models/todo");
const router = express.Router();
const { sanitizeInput, sanitizeData } = require('../utils/sanitize');
const { schemaUpdate, schemaCreate } = require('../schemas/todoSchema');
const asyncHandler = require('../utils/asyncHandler');
const authenticateToken = require('../utils/authenticateToken');

router.use(authenticateToken);

router.post("/", asyncHandler(async (req, res) => {
    const { error, value } = schemaCreate.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const sanitizedData = sanitizeData(value);
    sanitizedData.userId = req.user.id;
    const newTodo = await Todo.create(sanitizedData);
    res.status(201).json(newTodo);
}));

router.get("/", asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const { count: totalTodos, rows: todos } = await Todo.findAndCountAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset,
    });
    res.json({
        total: totalTodos,
        page: page,
        limit: limit,
        totalPages: Math.ceil(totalTodos / limit),
        data: todos,
    });
}));

router.get("/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findOne({
        where: {
            id: id,
            userId: req.user.id
        },
    });
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
}));

router.put("/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { error, value } = schemaUpdate.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    const todo = await Todo.findOne({
        where: {
            id: id,
            userId: req.user.id
        },
    });
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    }
    const sanitizedData = sanitizeData(value);
    await todo.update(sanitizedData);
    res.json(todo);
}));

router.delete("/:id", asyncHandler(async (req, res) => {
    const { id } = req.params;
    const todo = await Todo.findOne({
        where: {
            id: id,
            userId: req.user.id
        },
    });
    if (!todo) {
        return res.status(404).json({ error: "Todo not found" });
    };
    await todo.destroy();
    res.json({ message: "Todo deleted" });
}));

module.exports = router;