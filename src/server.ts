import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { createDataFolder, controller } from './gtfsController';

const app = express();
const upload = multer({ dest: 'data/' });

app.use(cors());
app.use(express.json());

// Create data folder at startup
createDataFolder();

app.use('/api', (req, res, next) => {
    req.datasetId = req.query.dataset as string || 'default';
    return next();
});

// Routes
app.post('/upload', upload.array('files'), async (req, res, next) => {
    try {
        await controller.uploadFiles(req, res);
    } catch (error) {
        return next(error);
    }
});

app.get('/api/agencies', controller.getAgencies);
app.get('/api/stops', controller.getStops);
app.get('/api/routes', controller.getRoutes);
app.get('/api/trips', controller.getTrips);
app.get('/api/stop-times', controller.getStopTimes);
app.get('/api/transfers', controller.getTransfers);
app.get('/api/shapes', controller.getShapes);
app.get('/api/calendar', controller.getCalendar);


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT} — 🚇🌳`);
});