const express=require('express');
const {v4:uuidv4 }=require('uuid');
const { ingestionStore, batchStore }=require('./store.js');
const { enqueueIngestion } =require('./processor.js');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;

app.post('/ingest', (req, res) => {
  const { ids, priority } = req.body;
  if (!ids || !priority || !Array.isArray(ids)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  const ingestion_id = uuidv4();
  const timestamp = Date.now();

 
  const batches = [];
  for (let i = 0; i < ids.length; i += 3) {
    const batch_ids = ids.slice(i, i + 3);
    const batch_id = uuidv4();
    batches.push({ batch_id, ids: batch_ids, status: 'yet_to_start', priority, created_at: timestamp });
    batchStore.set(batch_id, { ingestion_id, ids: batch_ids, status: 'yet_to_start', created_at: timestamp, priority });
  }

  ingestionStore.set(ingestion_id, { ingestion_id, status: 'yet_to_start', batches }); 
  enqueueIngestion(ingestion_id, priority, timestamp, batches);

  res.json({ ingestion_id });
});

app.get('/status/:ingestion_id', (req, res) => {
  const ingestion_id = req.params.ingestion_id;
  const record = ingestionStore.get(ingestion_id);

  if (!record) {
    return res.status(404).json({ error: 'Ingestion not found' });
  }

  const batchStatuses = record.batches.map(b => {
    const current = batchStore.get(b.batch_id);
    return { batch_id: b.batch_id, ids: current.ids, status: current.status };
  });

  const statuses = batchStatuses.map(b => b.status);
  let status = 'yet_to_start';
  if (statuses.every(s => s === 'completed')) status = 'completed';
  else if (statuses.some(s => s === 'triggered' || s === 'completed')) status = 'triggered';

  res.json({
    ingestion_id,
    status,
    batches: batchStatuses
  });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
