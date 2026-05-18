require('dotenv').config();
const express = require('express');
const cors = require('cors');

const agendasRouter = require('./routes/agendas');
const inquiriesRouter = require('./routes/inquiries');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api/agendas', agendasRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/admin', adminRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
