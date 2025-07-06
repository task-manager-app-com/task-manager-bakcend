// Create a new task
const addTask = (req, res) => {
    const { name, description, is_completed = false } = req.body;
    const query = `
      INSERT INTO todos (name, description, is_completed, createAt)
      VALUES (?, ?, ?, NOW())
    `;
    req.db.query(query, [name, description, is_completed], (err, results) => {
        if (err) {
            console.error("Error creating task:", err);
            return res.status(500).json({ message: "Error creating new task", error: err });
        }
        req.db.query('SELECT * FROM todos WHERE id = ?', [results.insertId], (err2, rows) => {
            if (err2) {
                return res.status(500).json({ message: "Error fetching new task", error: err2 });
            }
            res.status(201).json(rows[0]);
        });
    });
};

// Get up to 5 incomplete tasks
const getAllTasks = (req, res) => {
    const query = `
      SELECT * FROM todos
      WHERE is_completed = FALSE
      ORDER BY createAt DESC
      LIMIT 5
    `;
    req.db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching tasks", error: err });
        }
        res.json(results);
    });
};

// Get all completed tasks (history)
const getAllCompletedTasks = (req, res) => {
    const query = `
      SELECT * FROM todos
      WHERE is_completed = TRUE
      ORDER BY completed_date DESC
    `;
    req.db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: "Error fetching completed tasks", error: err });
        }
        res.json(results);
    });
};

// Complete a task
const completingTask = (req, res) => {
    const taskId = req.params.id;
    const query = `
      UPDATE todos
      SET is_completed = TRUE, completed_date = NOW()
      WHERE id = ?
    `;
    req.db.query(query, [taskId], (err, result) => {
        if (err) {
            return res.status(500).json({ message: "Error completing the task", error: err });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Task not found" });
        }
        req.db.query('SELECT * FROM todos WHERE id = ?', [taskId], (err2, rows) => {
            if (err2) {
                return res.status(500).json({ message: "Error fetching updated task", error: err2 });
            }
            res.json(rows[0]);
        });
    });
};

module.exports = {
    addTask,
    getAllTasks,
    completingTask,
    getAllCompletedTasks,
};