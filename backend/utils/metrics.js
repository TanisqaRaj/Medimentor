// In-memory metrics store — resets on server restart
// For production persistence, push to Upstash Redis

const metrics = {
  startTime: Date.now(),
  requests: { total: 0, success: 0, errors: 0 },
  responseTimes: [],          // last 1000 response times (ms)
  statusCodes: {},            // { "200": 42, "404": 3, ... }
  slowRequests: [],           // requests > 1000ms (last 50)
  activeConnections: 0,
  socketEvents: { total: 0, appointmentUpdates: 0, videoSignals: 0 },
  errors: [],                 // last 50 errors with stack
  endpoints: {},              // per-route hit counts
};

// Track a completed HTTP request
export const recordRequest = (method, path, statusCode, durationMs) => {
  metrics.requests.total++;
  if (statusCode < 400) metrics.requests.success++;
  else metrics.requests.errors++;

  // Status code distribution
  metrics.statusCodes[statusCode] = (metrics.statusCodes[statusCode] || 0) + 1;

  // Response time (keep last 1000)
  metrics.responseTimes.push(durationMs);
  if (metrics.responseTimes.length > 1000) metrics.responseTimes.shift();

  // Slow request log (keep last 50)
  if (durationMs > 1000) {
    metrics.slowRequests.unshift({ method, path, statusCode, durationMs, time: new Date().toISOString() });
    if (metrics.slowRequests.length > 50) metrics.slowRequests.pop();
  }

  // Per-endpoint counts
  const key = `${method} ${path}`;
  metrics.endpoints[key] = (metrics.endpoints[key] || 0) + 1;
};

// Track an error
export const recordError = (message, stack, context = {}) => {
  metrics.errors.unshift({ message, stack, context, time: new Date().toISOString() });
  if (metrics.errors.length > 50) metrics.errors.pop();
};

// Track socket events
export const recordSocketEvent = (type) => {
  metrics.socketEvents.total++;
  if (type === "appointmentUpdate") metrics.socketEvents.appointmentUpdates++;
  if (type === "videoSignal") metrics.socketEvents.videoSignals++;
};

export const incrementConnections = () => metrics.activeConnections++;
export const decrementConnections = () => metrics.activeConnections--;

// Build the stats snapshot for admin
export const getMetrics = () => {
  const times = metrics.responseTimes;
  const avg = times.length ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  const sorted = [...times].sort((a, b) => a - b);
  const p95 = sorted.length ? sorted[Math.floor(sorted.length * 0.95)] : 0;
  const p99 = sorted.length ? sorted[Math.floor(sorted.length * 0.99)] : 0;

  const uptimeSeconds = Math.floor((Date.now() - metrics.startTime) / 1000);
  const mem = process.memoryUsage();

  return {
    uptime: {
      seconds: uptimeSeconds,
      human: formatUptime(uptimeSeconds),
    },
    requests: metrics.requests,
    responseTime: { avg, p95, p99, samples: times.length },
    statusCodes: metrics.statusCodes,
    slowRequests: metrics.slowRequests,
    activeConnections: metrics.activeConnections,
    socketEvents: metrics.socketEvents,
    memory: {
      heapUsedMB: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotalMB: Math.round(mem.heapTotal / 1024 / 1024),
      rssMB: Math.round(mem.rss / 1024 / 1024),
    },
    topEndpoints: Object.entries(metrics.endpoints)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([endpoint, hits]) => ({ endpoint, hits })),
    recentErrors: metrics.errors.slice(0, 10),
  };
};

const formatUptime = (s) => {
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
};
