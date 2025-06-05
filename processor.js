const { queue } =require('./priorityQueue.js');
const { batchStore } =require('./store.js');

let isProcessing = false;

function enqueueIngestion(ingestion_id, priority, created_at, batches) {
  batches.forEach(batch => {
    queue.enqueue({
      batch_id: batch.batch_id,
      ids: batch.ids,
      ingestion_id,
      priority,
      created_at
    });
  });
  processQueue();
}

async function processQueue() {
  if (isProcessing) return;

  isProcessing = true;

  while (!queue.isEmpty()) {
    const batch = queue.dequeue();
    const { batch_id, ids } = batch;
    batchStore.get(batch_id).status = 'triggered';
    await simulateExternalAPI(ids);
    batchStore.get(batch_id).status = 'completed';
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  isProcessing = false;
}

function simulateExternalAPI(ids) {
  return new Promise(resolve => {
    setTimeout(() => {
      ids.forEach(id => {
        console.log(`Processed ID ${id}`);
      });
      resolve();
    }, 1000); 
  });
}


module.exports = {
    enqueueIngestion
};
