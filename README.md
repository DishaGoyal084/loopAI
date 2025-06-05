# Data Ingestion API

A simple Node.js RESTful API service to asynchronously ingest data in batches with priority and rate limiting.

---

## Overview

This project implements a data ingestion system with two main endpoints:

- **POST /ingest** — Accepts a list of IDs and a priority, queues them as batches for asynchronous processing.
- **GET /status/:ingestion_id** — Returns the processing status of the ingestion request, including batch-level details.

---

## Features

- **Batch processing:** IDs are split into batches of 3.
- **Asynchronous processing:** Batches are processed asynchronously in the background.
- **Priority queue:** Requests with higher priority are processed first.
- **Rate limiting:** Only one batch is processed every 5 seconds to simulate an external API rate limit.
- **Status tracking:** Track each batch status as `yet_to_start`, `triggered`, or `completed`.
- **In-memory storage:** All ingestion and batch statuses are stored in-memory for quick retrieval.

---

## API Endpoints

### POST /ingest

**Request body:**

```json
{
  "ids": [1, 2, 3, 4, 5],
  "priority": "HIGH"
}
