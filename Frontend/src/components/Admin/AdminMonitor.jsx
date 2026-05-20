import { useEffect, useState, useCallback, useRef } from "react";
import api from "../../api";
import { useSelector } from "react-redux";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

const StatCard = ({ label, value, icon, color = "text-emerald-600", bg = "bg-emerald-50", unit = "" }) => (
  <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-5 shadow-sm flex items-center gap-4">
    <div className={`w-11 h-11 ${bg} ${color} rounded-xl flex items-center justify-center shrink-0`}>
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <div>
      <div className="font-headline-md text-headline-md text-on-surface">{value}{unit}</div>
      <div className="font-caption text-caption text-on-surface-variant">{label}</div>
    </div>
  </div>
);

const AdminMonitor = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const autoRefreshRef = useRef(autoRefresh);
  const token = useSelector((state) => state.auth.accessToken);

  const tokenRef = useRef(token);
  useEffect(() => { tokenRef.current = token; }, [token]);

  const fetchMetrics = useCallback(async () => {
    try {
      const { data } = await api.get(`${BACKEND}/monitor/stats`, {
        headers: { Authorization: `Bearer ${tokenRef.current}` },
      });
      if (data.success) setMetrics(data.metrics);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  }, []); // stable — reads token via ref, no deps that change

  // Keep ref in sync so the interval can read the latest value without being a dependency
  useEffect(() => { autoRefreshRef.current = autoRefresh; }, [autoRefresh]);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(() => {
      if (autoRefreshRef.current) fetchMetrics();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchMetrics]); // fetchMetrics is now stable, interval created only once

  if (loading) return (
    <div className="w-full flex-grow flex items-center justify-center">
      <span className="material-symbols-outlined text-4xl text-outline animate-spin">progress_activity</span>
    </div>
  );

  if (error) return (
    <div className="w-full flex-grow flex items-center justify-center">
      <div className="text-center">
        <span className="material-symbols-outlined text-4xl text-error mb-2 block">error</span>
        <p className="text-on-surface-variant">{error}</p>
      </div>
    </div>
  );

  const m = metrics;
  const errorRate = m.requests.total > 0 ? ((m.requests.errors / m.requests.total) * 100).toFixed(1) : 0;

  return (
    <div className="w-full flex-grow max-w-[1280px] mx-auto px-6 py-8 font-manrope overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-1">Server Monitor</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Live performance and health metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${autoRefresh ? "bg-emerald-100 text-emerald-700" : "bg-surface-container text-on-surface-variant"}`}>
            <span className={`w-2 h-2 rounded-full ${autoRefresh ? "bg-emerald-500 animate-pulse" : "bg-outline"}`} />
            {autoRefresh ? "Live" : "Paused"}
          </div>
          <button
            onClick={() => setAutoRefresh((v) => !v)}
            className="px-4 py-2 rounded-xl border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container font-label-md text-sm transition-all"
          >
            {autoRefresh ? "Pause" : "Resume"}
          </button>
          <button
            onClick={fetchMetrics}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-label-md text-sm transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 mb-6">
        <StatCard label="Uptime" value={m.uptime.human} icon="schedule" color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Total Requests" value={m.requests.total.toLocaleString()} icon="http" color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Errors" value={m.requests.errors} icon="error" color="text-red-600" bg="bg-red-50" />
        <StatCard label="Error Rate" value={errorRate} unit="%" icon="percent" color={errorRate > 5 ? "text-red-600" : "text-amber-600"} bg={errorRate > 5 ? "bg-red-50" : "bg-amber-50"} />
        <StatCard label="Active Sockets" value={m.activeConnections} icon="wifi" color="text-purple-600" bg="bg-purple-50" />
        <StatCard label="Heap Used" value={m.memory.heapUsedMB} unit=" MB" icon="memory" color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Response Times */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">speed</span>
            Response Times
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Avg", value: m.responseTime.avg, warn: 500, danger: 1000 },
              { label: "p95", value: m.responseTime.p95, warn: 1000, danger: 2000 },
              { label: "p99", value: m.responseTime.p99, warn: 2000, danger: 3000 },
            ].map(({ label, value, warn, danger }) => (
              <div key={label} className="text-center p-4 bg-surface-container rounded-xl">
                <div className={`font-headline-lg text-2xl font-bold ${value > danger ? "text-red-600" : value > warn ? "text-amber-600" : "text-emerald-600"}`}>
                  {value}<span className="text-sm font-normal text-on-surface-variant ml-1">ms</span>
                </div>
                <div className="font-caption text-caption text-on-surface-variant mt-1">{label}</div>
              </div>
            ))}
          </div>
          <p className="font-caption text-caption text-outline mt-3">Based on {m.responseTime.samples.toLocaleString()} samples</p>
        </div>

        {/* Status Code Distribution */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">bar_chart</span>
            Status Codes
          </h2>
          <div className="space-y-2">
            {Object.entries(m.statusCodes).sort((a, b) => b[1] - a[1]).map(([code, count]) => {
              const pct = m.requests.total > 0 ? Math.round((count / m.requests.total) * 100) : 0;
              const color = code.startsWith("2") ? "bg-emerald-500" : code.startsWith("4") ? "bg-amber-500" : code.startsWith("5") ? "bg-red-500" : "bg-blue-500";
              return (
                <div key={code} className="flex items-center gap-3">
                  <span className="font-label-md text-sm text-on-surface w-12 shrink-0">{code}</span>
                  <div className="flex-grow bg-surface-container rounded-full h-2">
                    <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="font-caption text-caption text-on-surface-variant w-16 text-right">{count} ({pct}%)</span>
                </div>
              );
            })}
            {Object.keys(m.statusCodes).length === 0 && <p className="text-on-surface-variant font-body-md text-sm">No requests yet</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Socket Events */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">bolt</span>
            Socket Events
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Total", value: m.socketEvents.total, icon: "bolt" },
              { label: "Appointments", value: m.socketEvents.appointmentUpdates, icon: "event" },
              { label: "Video Signals", value: m.socketEvents.videoSignals, icon: "videocam" },
            ].map(({ label, value, icon }) => (
              <div key={label} className="text-center p-4 bg-surface-container rounded-xl">
                <span className="material-symbols-outlined text-on-surface-variant text-xl mb-1 block">{icon}</span>
                <div className="font-headline-md text-xl font-bold text-on-surface">{value}</div>
                <div className="font-caption text-caption text-on-surface-variant">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Memory */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">memory</span>
            Memory Usage
          </h2>
          <div className="space-y-3">
            {[
              { label: "Heap Used", value: m.memory.heapUsedMB, total: m.memory.heapTotalMB },
              { label: "Heap Total", value: m.memory.heapTotalMB, total: m.memory.rssMB },
              { label: "RSS", value: m.memory.rssMB, total: m.memory.rssMB },
            ].map(({ label, value, total }) => {
              const pct = total > 0 ? Math.round((value / total) * 100) : 0;
              const color = pct > 85 ? "bg-red-500" : pct > 60 ? "bg-amber-500" : "bg-emerald-500";
              return (
                <div key={label}>
                  <div className="flex justify-between font-caption text-caption text-on-surface-variant mb-1">
                    <span>{label}</span><span>{value} MB</span>
                  </div>
                  <div className="bg-surface-container rounded-full h-2">
                    <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${Math.min(pct, 100)}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Top Endpoints */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">route</span>
            Top Endpoints
          </h2>
          <div className="space-y-2">
            {m.topEndpoints.length === 0 && <p className="text-on-surface-variant font-body-md text-sm">No data yet</p>}
            {m.topEndpoints.map(({ endpoint, hits }, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-outline-variant/20 last:border-0">
                <span className="font-body-md text-sm text-on-surface font-mono truncate max-w-[70%]">{endpoint}</span>
                <span className="font-label-md text-sm text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">{hits} hits</span>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Requests */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
          <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600">hourglass_slow</span>
            Slow Requests (&gt;1s)
          </h2>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {m.slowRequests.length === 0 && <p className="text-on-surface-variant font-body-md text-sm">No slow requests 🎉</p>}
            {m.slowRequests.map((r, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-outline-variant/20 last:border-0">
                <div>
                  <span className="font-label-md text-sm text-on-surface font-mono">{r.method} {r.path}</span>
                  <div className="font-caption text-[10px] text-outline">{new Date(r.time).toLocaleTimeString()}</div>
                </div>
                <span className="font-label-md text-sm text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full shrink-0">{r.durationMs}ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/50 p-6 shadow-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600">bug_report</span>
          Recent Errors
        </h2>
        {m.recentErrors.length === 0 ? (
          <p className="text-emerald-600 font-body-md text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">check_circle</span>
            No errors recorded
          </p>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {m.recentErrors.map((err, i) => (
              <div key={i} className="bg-red-50 border border-red-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-label-md text-sm text-red-700 font-medium">{err.message}</span>
                  <span className="font-caption text-[10px] text-red-400 shrink-0">{new Date(err.time).toLocaleTimeString()}</span>
                </div>
                {err.stack && (
                  <pre className="font-caption text-[10px] text-red-500 overflow-x-auto whitespace-pre-wrap line-clamp-3">{err.stack}</pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMonitor;
