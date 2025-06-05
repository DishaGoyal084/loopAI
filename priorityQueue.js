const PRIORITY_LEVELS = { HIGH: 1, MEDIUM: 2, LOW: 3 };

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item) {
    this.items.push(item);
    this.items.sort((a, b) => {
      const prioDiff = PRIORITY_LEVELS[a.priority] - PRIORITY_LEVELS[b.priority];
      return prioDiff !== 0 ? prioDiff : a.created_at - b.created_at;
    });
  }

  dequeue() {
    return this.items.shift();
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

const queue = new PriorityQueue();

module.exports = {
  queue
};