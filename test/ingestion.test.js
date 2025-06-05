import request from 'supertest';
const express=require('express');
const {app}=require('../server.js');

describe('Data Ingestion API', () => {
  it('should ingest and check status correctly', async () => {
    const res = await request('http://localhost:5000')
      .post('/ingest')
      .send({ ids: [1, 2, 3, 4, 5], priority: 'MEDIUM' });

    expect(res.body.ingestion_id).toBeDefined();

    const statusRes = await request('http://localhost:5000')
      .get(`/status/${res.body.ingestion_id}`);

    expect(statusRes.body.ingestion_id).toBe(res.body.ingestion_id);
    expect(statusRes.body.status).toMatch(/yet_to_start|triggered|completed/);
  });
});
