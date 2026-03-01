require('dotenv').config();

const express = require('express');
const path = require('path');

const itemRoutes = require('./routes/itemRoutes');
const claimRoutes = require('./routes/claimRoutes');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parser middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Simple layout middleware (manual approach without express-ejs-layouts)
// We'll use a custom render wrapper
const originalRender = express.response.render;
express.response.render = function (view, options, callback) {
    const res = this;
    const req = this.req;

    // Render the view content first
    const app = req.app;
    app.render(view, options, (err, html) => {
        if (err) {
            if (callback) return callback(err);
            return res.status(500).send('Render error');
        }

        // If it's the error page or layout itself, don't wrap
        if (view === 'layout') {
            if (callback) return callback(null, html);
            return res.send(html);
        }

        // Wrap in layout
        const layoutOptions = { ...options, body: html };
        app.render('layout', layoutOptions, (err2, fullHtml) => {
            if (err2) {
                if (callback) return callback(err2);
                return res.status(500).send('Layout render error');
            }
            if (callback) return callback(null, fullHtml);
            res.send(fullHtml);
        });
    });
};

// Routes
app.get('/', (req, res) => {
    res.redirect('/items');
});

app.use('/items', itemRoutes);
app.use('/claims', claimRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).render('error', { title: 'Not Found', message: 'Page not found' });
});

// Error handler middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
