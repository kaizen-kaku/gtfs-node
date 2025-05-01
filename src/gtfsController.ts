import { promises as fs } from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { parse } from 'csv-parse/sync';

// GTFS Interfaces
interface Agency {
    agency_id: string;
    agency_name: string;
    agency_url: string;
    agency_timezone: string;
    agency_lang?: string;
    agency_phone?: string;
}

interface Stop {
    stop_id: string;
    stop_code?: string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    zone_id?: string;
}

interface Route {
    route_id: string;
    agency_id?: string;
    route_short_name: string;
    route_long_name: string;
    route_type: number;
    route_color?: string;
    route_text_color?: string;
}

interface Trip {
    trip_id: string;
    route_id: string;
    service_id: string;
    trip_headsign?: string;
    direction_id?: number;
    shape_id?: string;
}

interface StopTime {
    trip_id: string;
    arrival_time: string;
    departure_time: string;
    stop_id: string;
    stop_sequence: number;
}

declare global {
    namespace Express {
        interface Request {
            datasetId: string;
        }
    }
}

export const createUploadsFolder = async () => {
    console.log('Creating uploads folder...');
    try {
        await fs.mkdir('uploads/datasets', { recursive: true });
    } catch (error) {
        console.error('Error creating uploads folder:', error);
    }
};

const getDatasetPath = (datasetId: string) => {
    return path.join('uploads/datasets', datasetId);
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
            // Cleanup failed upload
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
    }
};