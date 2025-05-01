export interface Agency {
    agency_id: string;
    agency_name: string;
    agency_url: string;
    agency_timezone: string;
    agency_lang?: string;
    agency_phone?: string;
}

export interface Stop {
    stop_id: string;
    stop_code?: string;
    stop_name: string;
    stop_lat: number;
    stop_lon: number;
    zone_id?: string;
}

export interface Route {
    route_id: string;
    agency_id?: string;
    route_short_name: string;
    route_long_name: string;
    route_type: number;
    route_color?: string;
    route_text_color?: string;
}

export interface Trip {
    trip_id: string;
    route_id: string;
    service_id: string;
    trip_headsign?: string;
    direction_id?: number;
    shape_id?: string;
}

export interface StopTime {
    trip_id: string;
    arrival_time: string;
    departure_time: string;
    stop_id: string;
    stop_sequence: number;
}

export interface Transfer {
    from_stop_id: string;
    to_stop_id: string;
    from_route_id?: string;
    to_route_id?: string;
    from_trip_id?: string;
    to_trip_id?: string;
    transfer_type: number;
    min_transfer_time?: number;
}

export interface Shape {
    shape_id: string;
    shape_pt_lat: number;
    shape_pt_lon: number;
    shape_pt_sequence: number;
    shape_dist_traveled?: number;
}

export interface Calendar {
    service_id: string;
    monday: 0 | 1;
    tuesday: 0 | 1;
    wednesday: 0 | 1;
    thursday: 0 | 1;
    friday: 0 | 1;
    saturday: 0 | 1;
    sunday: 0 | 1;
    start_date: string;
    end_date: string;
}

declare global {
    namespace Express {
        interface Request {
            datasetId: string;
        }
    }
}