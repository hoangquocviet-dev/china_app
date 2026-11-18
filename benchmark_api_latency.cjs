const https = require('https');
const http = require('http');
const { performance } = require('perf_hooks');

const SUPABASE_URL = 'https://eecfteeivqwkgzeezcfm.supabase.co';
const SUPABASE_KEY = 'sb_publishable_8WC_in4KQdELt8WD2npIhQ_Kw3WCu9A';
const VERCEL_URL = 'https://chinaapp.vercel.app';
const CDN_URL = 'https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/%E6%88%91.json';

const BENCH_SYNC_CODE = 'HF-BNCH-9999';

function makeRequest(urlStr, options = {}, body = null) {
  return new Promise((resolve) => {
    const url = new URL(urlStr);
    const client = url.protocol === 'https:' ? https : http;
    const start = performance.now();

    const headers = { ...(options.headers || {}) };
    let bodyPayload = null;
    if (body) {
      bodyPayload = typeof body === 'string' ? body : JSON.stringify(body);
      headers['Content-Length'] = Buffer.byteLength(bodyPayload);
    }

    const req = client.request(
      url,
      {
        method: options.method || 'GET',
        headers,
        timeout: 10000,
      },
      (res) => {
        let chunks = [];
        let ttfb = null;

        res.on('data', (chunk) => {
          if (ttfb === null) {
            ttfb = performance.now() - start;
          }
          chunks.push(chunk);
        });

        res.on('end', () => {
          const duration = performance.now() - start;
          const bodyStr = Buffer.concat(chunks).toString('utf8');
          resolve({
            statusCode: res.statusCode,
            duration,
            ttfb: ttfb || duration,
            body: bodyStr,
            error: null,
          });
        });
      }
    );

    req.on('error', (err) => {
      const duration = performance.now() - start;
      resolve({
        statusCode: 0,
        duration,
        ttfb: duration,
        body: '',
        error: err.message,
      });
    });

    req.on('timeout', () => {
      req.destroy();
      const duration = performance.now() - start;
      resolve({
        statusCode: 408,
        duration,
        ttfb: duration,
        body: '',
        error: 'Request Timeout (10s)',
      });
    });

    if (bodyPayload) {
      req.write(bodyPayload);
    }
    req.end();
  });
}

function calculatePercentiles(latencies) {
  if (latencies.length === 0) return { min: 0, p50: 0, p75: 0, p90: 0, p95: 0, p99: 0, max: 0, mean: 0, stdDev: 0 };
  const sorted = [...latencies].sort((a, b) => a - b);
  const getP = (p) => {
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
  };

  const sum = sorted.reduce((acc, v) => acc + v, 0);
  const mean = sum / sorted.length;
  const variance = sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / sorted.length;
  const stdDev = Math.sqrt(variance);

  return {
    min: Math.round(sorted[0]),
    p50: Math.round(getP(50)),
    p75: Math.round(getP(75)),
    p90: Math.round(getP(90)),
    p95: Math.round(getP(95)),
    p99: Math.round(getP(99)),
    max: Math.round(sorted[sorted.length - 1]),
    mean: Math.round(mean),
    stdDev: Math.round(stdDev),
  };
}

async function benchmarkEndpoint(name, url, options, body, samples = 25) {
  process.stdout.write(`Đang đo kiểm [${name}] (${samples} samples)... `);
  const latencies = [];
  const ttfbs = [];
  let successCount = 0;

  // 1 warm-up request
  await makeRequest(url, options, body);

  for (let i = 0; i < samples; i++) {
    const res = await makeRequest(url, options, body);
    if (res.statusCode >= 200 && res.statusCode < 400) {
      successCount++;
    } else if (i === 0) {
      console.warn(`[WARN HTTP ${res.statusCode}] ${res.body.slice(0, 120)}`);
    }
    latencies.push(res.duration);
    ttfbs.push(res.ttfb);
    await new Promise((r) => setTimeout(r, 35));
  }

  const durationStats = calculatePercentiles(latencies);
  const ttfbStats = calculatePercentiles(ttfbs);
  const successRate = ((successCount / samples) * 100).toFixed(1);

  console.log(`Hoàn thành! P50: ${durationStats.p50}ms | P95: ${durationStats.p95}ms | Thành công: ${successRate}%`);

  return {
    name,
    samples,
    successRate: `${successRate}%`,
    duration: durationStats,
    ttfb: ttfbStats,
  };
}

async function cleanupBenchmarkData() {
  await makeRequest(
    `${SUPABASE_URL}/rest/v1/hanzi_profiles?sync_code=eq.${BENCH_SYNC_CODE}`,
    {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_KEY,
        'x-sync-code': BENCH_SYNC_CODE,
      },
    }
  );
}

async function main() {
  console.log('========================================================================');
  console.log('   TIẾN TRÌNH ĐO KIỂM HIỆU NĂNG & ĐỘ TRỄ API (P50, P90, P95, P99)');
  console.log('   HanziFlow PWA: Supabase Database, Vercel Edge & Asset CDN');
  console.log('========================================================================\n');

  const results = [];

  // 1. Supabase PostgREST - Read Leaderboard Top 10
  results.push(
    await benchmarkEndpoint(
      'Supabase GET Leaderboard (Top 10)',
      `${SUPABASE_URL}/rest/v1/hanzi_leaderboard?select=*&order=total_score.desc,updated_at.desc&limit=10`,
      {
        headers: { apikey: SUPABASE_KEY },
      },
      null,
      30
    )
  );

  // 2. Supabase PostgREST - Read Community Words (Top 50)
  results.push(
    await benchmarkEndpoint(
      'Supabase GET Community Words',
      `${SUPABASE_URL}/rest/v1/hanzi_community_words?select=*&order=updated_at.desc&limit=50`,
      {
        headers: { apikey: SUPABASE_KEY },
      },
      null,
      30
    )
  );

  // 3. Supabase PostgREST - Read Profile by Sync Code
  results.push(
    await benchmarkEndpoint(
      'Supabase GET Profile (Zero-auth Sync)',
      `${SUPABASE_URL}/rest/v1/hanzi_profiles?select=*&sync_code=eq.HF-YRQ9-L8D4&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          'x-sync-code': 'HF-YRQ9-L8D4',
        },
      },
      null,
      30
    )
  );

  // 4. Supabase PostgREST - Write/Upsert Profile (Cloud Sync Push)
  const benchProfilePayload = {
    sync_code: BENCH_SYNC_CODE,
    nickname: 'BenchmarkBot',
    srs_progress: { 'w_01': { box: 2 } },
    mastered_flashcard_ids: ['w_01'],
    custom_words: [],
    custom_dictionary: [],
    custom_sentences: [],
    deleted_builtins: { words: [], sentences: [] },
    lesson_config: {},
    high_scores: { blitzBestScore: 100, matchBestScore: 200, runnerBestScore: 300, totalGamesPlayed: 5 },
    mastered_count: 1,
    streak: 1,
    updated_at: new Date().toISOString(),
  };

  results.push(
    await benchmarkEndpoint(
      'Supabase POST Profile Upsert',
      `${SUPABASE_URL}/rest/v1/hanzi_profiles?on_conflict=sync_code`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_KEY,
          'Content-Type': 'application/json',
          Prefer: 'resolution=merge-duplicates,return=minimal',
          'x-sync-code': BENCH_SYNC_CODE,
        },
      },
      benchProfilePayload,
      25
    )
  );

  // 5. Vercel Production HTML (TTFB & Edge CDN)
  results.push(
    await benchmarkEndpoint(
      'Vercel CDN GET Main Index (HTML/TTFB)',
      `${VERCEL_URL}/`,
      {},
      null,
      25
    )
  );

  // 6. Vercel Production PWA Manifest
  results.push(
    await benchmarkEndpoint(
      'Vercel CDN GET Manifest.webmanifest',
      `${VERCEL_URL}/manifest.webmanifest`,
      {},
      null,
      25
    )
  );

  // 7. HanziWriter JSDelivr CDN (CJK Stroke JSON)
  results.push(
    await benchmarkEndpoint(
      'JSDelivr CDN GET Stroke Data (字: 我)',
      CDN_URL,
      {},
      null,
      25
    )
  );

  await cleanupBenchmarkData();

  console.log('\n========================================================================');
  console.log('                      BẢNG TỔNG HỢP ĐO ĐỘ TRỄ (ms)');
  console.log('========================================================================\n');

  console.table(
    results.map((r) => ({
      'API / Endpoint': r.name,
      'Số mẫu': r.samples,
      'Thành công': r.successRate,
      'Min (ms)': r.duration.min,
      'P50 (ms)': r.duration.p50,
      'P75 (ms)': r.duration.p75,
      'P90 (ms)': r.duration.p90,
      'P95 (ms)': r.duration.p95,
      'P99 (ms)': r.duration.p99,
      'Max (ms)': r.duration.max,
      'Avg (ms)': r.duration.mean,
      'StdDev': r.duration.stdDev,
    }))
  );

  const fs = require('fs');
  const path = require('path');
  const reportPath = path.join(__dirname, 'api-latency-benchmark-result.json');
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\nKết quả chi tiết dạng JSON đã lưu tại: ${reportPath}\n`);
}

main().catch(console.error);
