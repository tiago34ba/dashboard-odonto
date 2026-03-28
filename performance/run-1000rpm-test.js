const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const TARGET_URL = process.env.TARGET_URL || 'http://localhost:3001/';
const TOTAL_REQUESTS = Number(process.env.TOTAL_REQUESTS || 1000);
const TEST_DURATION_MS = Number(process.env.TEST_DURATION_MS || 60000);

function percentile(sortedArray, p) {
  if (sortedArray.length === 0) return 0;
  const index = Math.ceil((p / 100) * sortedArray.length) - 1;
  return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))];
}

function makeRequest(targetUrl) {
  return new Promise((resolve) => {
    const url = new URL(targetUrl);
    const client = url.protocol === 'https:' ? https : http;
    const start = process.hrtime.bigint();

    const req = client.request(
      {
        method: 'GET',
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        headers: {
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          Connection: 'close'
        },
        timeout: 20000
      },
      (res) => {
        let bytes = 0;
        res.on('data', (chunk) => {
          bytes += chunk.length;
        });
        res.on('end', () => {
          const end = process.hrtime.bigint();
          const latencyMs = Number(end - start) / 1e6;
          resolve({
            ok: res.statusCode >= 200 && res.statusCode < 400,
            statusCode: res.statusCode,
            latencyMs,
            bytes,
            error: null
          });
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error('Request timeout'));
    });

    req.on('error', (error) => {
      const end = process.hrtime.bigint();
      const latencyMs = Number(end - start) / 1e6;
      resolve({
        ok: false,
        statusCode: null,
        latencyMs,
        bytes: 0,
        error: error.message
      });
    });

    req.end();
  });
}

async function run() {
  const startWall = Date.now();
  const intervalMs = TEST_DURATION_MS / TOTAL_REQUESTS;

  const promises = [];
  for (let i = 0; i < TOTAL_REQUESTS; i += 1) {
    const delay = Math.round(i * intervalMs);
    const p = new Promise((resolve) => {
      setTimeout(async () => {
        const result = await makeRequest(TARGET_URL);
        resolve(result);
      }, delay);
    });
    promises.push(p);
  }

  const results = await Promise.all(promises);
  const endWall = Date.now();

  const durationMs = endWall - startWall;
  const success = results.filter((r) => r.ok).length;
  const failed = results.length - success;
  const statusCounts = {};
  const errorCounts = {};
  let totalBytes = 0;

  for (const r of results) {
    if (r.statusCode !== null) {
      const key = String(r.statusCode);
      statusCounts[key] = (statusCounts[key] || 0) + 1;
    }
    if (r.error) {
      errorCounts[r.error] = (errorCounts[r.error] || 0) + 1;
    }
    totalBytes += r.bytes;
  }

  const latencies = results.map((r) => r.latencyMs).sort((a, b) => a - b);
  const avgLatency = latencies.reduce((acc, value) => acc + value, 0) / (latencies.length || 1);

  const achievedRps = results.length / (durationMs / 1000);
  const achievedRpm = results.length / (durationMs / 60000);

  const summary = {
    timestamp: new Date().toISOString(),
    targetUrl: TARGET_URL,
    plannedRequests: TOTAL_REQUESTS,
    plannedDurationMs: TEST_DURATION_MS,
    actualDurationMs: durationMs,
    completedRequests: results.length,
    success,
    failed,
    successRatePercent: Number(((success / results.length) * 100).toFixed(2)),
    throughput: {
      requestsPerSecond: Number(achievedRps.toFixed(2)),
      requestsPerMinute: Number(achievedRpm.toFixed(2)),
      bytesPerSecond: Number((totalBytes / (durationMs / 1000)).toFixed(2)),
      totalBytes
    },
    latencyMs: {
      min: Number((latencies[0] || 0).toFixed(2)),
      avg: Number(avgLatency.toFixed(2)),
      p50: Number(percentile(latencies, 50).toFixed(2)),
      p90: Number(percentile(latencies, 90).toFixed(2)),
      p95: Number(percentile(latencies, 95).toFixed(2)),
      p99: Number(percentile(latencies, 99).toFixed(2)),
      max: Number((latencies[latencies.length - 1] || 0).toFixed(2))
    },
    statusCounts,
    errorCounts
  };

  const outputDir = path.join(process.cwd(), 'performance');
  const jsonPath = path.join(outputDir, 'resultado-1000-acessos.json');
  const reportPath = path.join(outputDir, 'RELATORIO_DESEMPENHO_1000_ACESSOS.md');

  fs.writeFileSync(jsonPath, JSON.stringify(summary, null, 2), 'utf8');

  const report = `# Relatorio de Desempenho - 1000 Acessos por Minuto\n\n` +
    `- Data/Hora: ${summary.timestamp}\n` +
    `- Alvo: ${summary.targetUrl}\n` +
    `- Requisicoes planejadas: ${summary.plannedRequests}\n` +
    `- Duracao planejada: ${(summary.plannedDurationMs / 1000).toFixed(0)}s\n` +
    `- Duracao real: ${(summary.actualDurationMs / 1000).toFixed(2)}s\n\n` +
    `## Resultado Geral\n\n` +
    `- Requisicoes concluidas: ${summary.completedRequests}\n` +
    `- Sucesso: ${summary.success}\n` +
    `- Falhas: ${summary.failed}\n` +
    `- Taxa de sucesso: ${summary.successRatePercent}%\n\n` +
    `## Throughput\n\n` +
    `- Requests/segundo: ${summary.throughput.requestsPerSecond}\n` +
    `- Requests/minuto: ${summary.throughput.requestsPerMinute}\n` +
    `- Bytes/segundo: ${summary.throughput.bytesPerSecond}\n` +
    `- Total de bytes transferidos: ${summary.throughput.totalBytes}\n\n` +
    `## Latencia (ms)\n\n` +
    `- Min: ${summary.latencyMs.min}\n` +
    `- Media: ${summary.latencyMs.avg}\n` +
    `- P50: ${summary.latencyMs.p50}\n` +
    `- P90: ${summary.latencyMs.p90}\n` +
    `- P95: ${summary.latencyMs.p95}\n` +
    `- P99: ${summary.latencyMs.p99}\n` +
    `- Max: ${summary.latencyMs.max}\n\n` +
    `## Codigos HTTP\n\n` +
    '```json\n' + JSON.stringify(summary.statusCounts, null, 2) + '\n```\n\n' +
    `## Erros\n\n` +
    '```json\n' + JSON.stringify(summary.errorCounts, null, 2) + '\n```\n';

  fs.writeFileSync(reportPath, report, 'utf8');

  console.log(JSON.stringify({ jsonPath, reportPath, summary }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
