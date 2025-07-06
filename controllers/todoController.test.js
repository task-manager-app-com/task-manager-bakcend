const {
    addTask,
    getAllTasks,
    completingTask,
    getAllCompletedTasks,
} = require('./todoController');

describe('todoController', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {},
            params: {},
            db: {
                query: jest.fn(),
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    describe('addTask', () => {
        it('should create a new task and return it', (done) => {
            req.body = { name: 'Test Task', description: 'desc', is_completed: false };

            req.db.query
                .mockImplementationOnce((query, values, cb) => {
                    cb(null, { insertId: 1 });
                })
                .mockImplementationOnce((query, values, cb) => {
                    cb(null, [{ id: 1, name: 'Test Task', description: 'desc', is_completed: false }]);
                });

            addTask(req, res);

            setImmediate(() => {
                expect(req.db.query).toHaveBeenCalledTimes(2);
                expect(res.status).toHaveBeenCalledWith(201);
                expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                    id: 1,
                    name: 'Test Task',
                }));
                done();
            });
        });
        
        it('should return 500 if insert query errors', (done) => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

            req.body = { name: 'Test Task' };
            req.db.query.mockImplementationOnce((query, values, cb) => {
                cb(new Error('Insert error'), null);
            });

            addTask(req, res);

            setImmediate(() => {
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                    message: "Error creating new task",
                }));
                consoleSpy.mockRestore();
                done();
            });
        });
    });

    describe('getAllTasks', () => {
        it('should return list of incomplete tasks', (done) => {
            const fakeTasks = [
                { id: 1, name: 'task1', is_completed: false },
                { id: 2, name: 'task2', is_completed: false },
            ];

            req.db.query.mockImplementationOnce((query, cb) => {
                cb(null, fakeTasks);
            });

            getAllTasks(req, res);

            setImmediate(() => {
                expect(res.json).toHaveBeenCalledWith(fakeTasks);
                done();
            });
        });

        it('should return 500 if query errors', (done) => {
            req.db.query.mockImplementationOnce((query, cb) => {
                cb(new Error('DB error'), null);
            });

            getAllTasks(req, res);

            setImmediate(() => {
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                    message: "Error fetching tasks",
                }));
                done();
            });
        });
    });

    describe('getAllCompletedTasks', () => {
        it('should return completed tasks', (done) => {
            const fakeCompletedTasks = [
                { id: 3, name: 'done task', is_completed: true, completed_date: new Date() },
            ];

            req.db.query.mockImplementationOnce((query, cb) => {
                cb(null, fakeCompletedTasks);
            });

            getAllCompletedTasks(req, res);

            setImmediate(() => {
                expect(res.json).toHaveBeenCalledWith(fakeCompletedTasks);
                done();
            });
        });

        it('should return 500 if query errors', (done) => {
            req.db.query.mockImplementationOnce((query, cb) => {
                cb(new Error('DB error'), null);
            });

            getAllCompletedTasks(req, res);

            setImmediate(() => {
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                    message: "Error fetching completed tasks",
                }));
                done();
            });
        });
    });

    describe('completingTask', () => {
        it('should update task to completed and return it', (done) => {
            req.params.id = 1;

            req.db.query
                .mockImplementationOnce((query, values, cb) => {
                    cb(null, { affectedRows: 1 });
                })

                .mockImplementationOnce((query, values, cb) => {
                    cb(null, [{ id: 1, is_completed: true, completed_date: new Date() }]);
                });

            completingTask(req, res);

            setImmediate(() => {
                expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                    id: 1,
                    is_completed: true,
                }));
                done();
            });
        });

        it('should return 404 if no task found to update', (done) => {
            req.params.id = 99;

            req.db.query.mockImplementationOnce((query, values, cb) => {
                cb(null, { affectedRows: 0 });
            });

            completingTask(req, res);

            setImmediate(() => {
                expect(res.status).toHaveBeenCalledWith(404);
                expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                    message: "Task not found",
                }));
                done();
            });
        });

        it('should return 500 if update query errors', (done) => {
            req.params.id = 1;

            req.db.query.mockImplementationOnce((query, values, cb) => {
                cb(new Error('Update error'), null);
            });

            completingTask(req, res);

            setImmediate(() => {
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                    message: "Error completing the task",
                }));
                done();
            });
        });

        it('should return 500 if select query errors', (done) => {
            req.params.id = 1;

            req.db.query
                .mockImplementationOnce((query, values, cb) => {
                    cb(null, { affectedRows: 1 });
                })
                .mockImplementationOnce((query, values, cb) => {
                    cb(new Error('Select error'), null);
                });

            completingTask(req, res);

            setImmediate(() => {
                expect(res.status).toHaveBeenCalledWith(500);
                expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                    message: "Error fetching updated task",
                }));
                done();
            });
        });
    });
});