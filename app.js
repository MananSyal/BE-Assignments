const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

function getTasks() {
    const data = fs.readFileSync(path.join(__dirname, 'tasks.json'), 'utf8');
    return JSON.parse(data);
}

app.get('/tasks', (req, res) => {
    const tasks = getTasks();
    res.render('tasks', { tasks });
});

app.get('/task', (req, res) => {
    const tasks = getTasks();
    const task = tasks.find(t => t.id == req.query.id);
    if (task) {
        res.render('task', { task });
    } else {
        res.status(404).send('Task not found');
    }
});

app.get('/addTask', (req, res) => {
    res.render('addTask');
});

app.post('/add-task', (req, res) => {
    const tasks = getTasks();
    const newTask = { id: tasks.length + 1, name: req.body.name };
    tasks.push(newTask);
    fs.writeFileSync(path.join(__dirname, 'tasks.json'), JSON.stringify(tasks, null, 2));
    res.redirect('/tasks');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
