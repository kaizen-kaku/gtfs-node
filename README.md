# GTFS-Node

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

A lightweight, Express-based TypeScript API for working with GTFS (General Transit Feed Specification) data.

Developed by [Kaizen Kaku Co., Ltd.](https://kaizenkaku.co.jp/)

## Overview

GTFS-Node provides an easy way to upload and access GTFS data through a RESTful API. Perfect for transit application developers, urban planners, and anyone working with public transportation data.

The API supports all standard GTFS files, including agencies, stops, routes, trips, stop times, transfers, shapes, and calendars.

## Features

- 🚄 **Simple API** for accessing GTFS data components
- 📁 **Support for multiple datasets** within a single instance
- 🗂️ **File Upload API** for organizing GTFS data
- 🧩 **TypeScript support** with complete type definitions
- 🔍 **MTA Subway data** included as an example

## Getting Started

### Prerequisites

- Node.js (v14+)
- pnpm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/gtfs-node.git
cd gtfs-node
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

For production use:

```bash
pnpm start
```

The server will start on port 3000 by default (configurable via the PORT environment variable).

## Usage

### Working with GTFS Data

Place your GTFS .txt files in the `data/xxx`, where 'xxx' is your GTFS data.

#### Included Example Data

The repository includes MTA Subway GTFS data as an example, located in the `data/mta` directory.

### API Endpoints

All data endpoints accept a `?dataset=` query parameter to specify which dataset to use.

#### File Upload

```
POST /upload
```

Upload GTFS files to create or update a dataset.

#### Data Access

```
GET /api/agencies       # Get all agencies
GET /api/stops          # Get all stops
GET /api/routes         # Get all routes
GET /api/trips          # Get all trips
GET /api/stop-times     # Get all stop times
GET /api/transfers      # Get all transfers
GET /api/shapes         # Get all shapes
GET /api/calendar       # Get calendar data
```

### Example Request

```bash
# Get all stops from the MTA Subway dataset
curl http://localhost:3000/api/stops?dataset=mta
```

## Data Organization

GTFS data is organized in the following structure:

```
data/
├── mta/         # MTA Subway example
│   ├── agency.txt
│   ├── stops.txt
│   └── ...
└── custom-dataset/     # Your custom datasets
    ├── agency.txt
    ├── stops.txt
    └── ...
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Check out the Issues tab to find ways to contribute. 

## License

This project is licensed under the MIT License - see the LICENSE file for details.

Copyright (c) 2025 Kaizen Kaku Co., Ltd.