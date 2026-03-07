require('dotenv').config();

const express = require('express');
const path = require('path');

const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const errorHandler = require('./middlewares/errorHandler');
const AppError = require('./middlewares/AppError');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Process-level error guards ──────────────────────────────────────────────

process.on('uncaughtException', (err) => {
    console.error(`[${new Date().toISOString()}] UNCAUGHT EXCEPTION — shutting down`);
    console.error(err.name, err.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason) => {
    console.error(`[${new Date().toISOString()}] UNHANDLED REJECTION — shutting down`);
    console.error(reason);
    process.exit(1);
});

// ─── View engine setup ───────────────────────────────────────────────────────

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Body parser middleware ──────────────────────────────────────────────────

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Layout wrapper (manual, no extra package) ───────────────────────────────

const originalRender = express.response.render;
express.response.render = function (view, options, callback) {
    const res = this;
    const req = this.req;

    const appInstance = req.app;
    appInstance.render(view, options, (err, html) => {
        if (err) {
            if (callback) return callback(err);
            return res.status(500).send('Render error');
        }

        // Don't wrap the layout or error page in itself
        if (view === 'layout') {
            if (callback) return callback(null, html);
            return res.send(html);
        }

        const layoutOptions = { ...options, body: html };
        appInstance.render('layout', layoutOptions, (err2, fullHtml) => {
            if (err2) {
                if (callback) return callback(err2);
                return res.status(500).send('Layout render error');
            }
            if (callback) return callback(null, fullHtml);
            res.send(fullHtml);
        });
    });
};

// ─── Routes ──────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
    res.redirect('/items');
});

app.use('/items', itemRoutes);
app.use('/claims', claimRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────

app.use((req, res, next) => {
    next(new AppError(`Cannot ${req.method} ${req.originalUrl} — page not found`, 404));
});

// ─── Centralized error handler ───────────────────────────────────────────────

app.use(errorHandler);

// ─── Start server ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
    console.log(`[${new Date().toISOString()}] Server running on http://localhost:${PORT}`);
});

module.exports = app;
