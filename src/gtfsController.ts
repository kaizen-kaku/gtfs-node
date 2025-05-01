import { promises as fs } from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { parse } from 'csv-parse/sync';
import {
    Agency,
    Stop,
    Route,
    Trip,
    StopTime,
    Transfer,
    Shape,
    Calendar
} from './types';

export const createDataFolder = async () => {
    try {
        await fs.mkdir('data', { recursive: true });
    } catch (error) {
        console.error('Error creating data folder:', error);
    }
};

const getDatasetPath = (datasetId: string) => {
    return path.join('data', datasetId);
};

const readGTFSFile = async <T>(datasetId: string, fileName: string): Promise<T[]> => {
    const filePath = path.join(getDatasetPath(datasetId), fileName);
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return parse(data, {
            columns: true,
            skip_empty_lines: true,
            cast: (value, context) => {
                if (context.column === 'stop_lat' || context.column === 'stop_lon')
                    return parseFloat(value);
                if (context.column === 'route_type' || context.column === 'direction_id')
                    return parseInt(value);
                return value;
            }
        }) as T[];
    } catch (error) {
        throw new Error(`File ${fileName} not found in dataset ${datasetId}`);
    }
};

export const controller = {
    uploadFiles: async (req: Request, res: Response) => {
        if (!req.files?.length) return res.status(400).json({ error: 'No files uploaded' });

        const datasetId = req.body.dataset || `dataset-${Date.now()}`;
        const datasetPath = getDatasetPath(datasetId);

        try {
            await fs.mkdir(datasetPath, { recursive: true });
            const files = req.files as Express.Multer.File[];

            await Promise.all(files.map(async (file) => {
                const destPath = path.join(datasetPath, file.originalname);
                await fs.rename(file.path, destPath);
            }));

            res.json({
                datasetId,
                message: `${files.length} files organized in dataset`,
                files: files.map(f => f.originalname)
            });
        } catch (error) {
            console.error('Upload error:', error);
            await fs.rm(datasetPath, { recursive: true, force: true });
            res.status(500).json({ error: 'Error processing files' });
        }
    },

    getAgencies: async (req: Request, res: Response) => {
        try {
            const agencies = await readGTFSFile<Agency>(req.datasetId, 'agency.txt');
            res.json(agencies);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    getStops: async (req: Request, res: Response) => {
        try {
            const stops = await readGTFSFile<Stop>(req.datasetId, 'stops.txt');
            res.json(stops);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    getRoutes: async (req: Request, res: Response) => {
        try {
            const routes = await readGTFSFile<Route>(req.datasetId, 'routes.txt');
            res.json(routes);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    getTrips: async (req: Request, res: Response) => {
        try {
            const trips = await readGTFSFile<Trip>(req.datasetId, 'trips.txt');
            res.json(trips);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    getStopTimes: async (req: Request, res: Response) => {
        try {
            const stopTimes = await readGTFSFile<StopTime>(req.datasetId, 'stop_times.txt');
            res.json(stopTimes);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    getTransfers: async (req: Request, res: Response) => {
        try {
            const transfers = await readGTFSFile<Transfer>(req.datasetId, 'transfers.txt');
            res.json(transfers);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    getShapes: async (req: Request, res: Response) => {
        try {
            const shapes = await readGTFSFile<Shape>(req.datasetId, 'shapes.txt');
            res.json(shapes);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    },

    getCalendar: async (req: Request, res: Response) => {
        try {
            const calendar = await readGTFSFile<Calendar>(req.datasetId, 'calendar.txt');
            res.json(calendar);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }
};