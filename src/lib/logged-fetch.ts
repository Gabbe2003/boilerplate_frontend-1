// lib/logged-fetch.ts
'use server';

import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'api-logs.txt');

function writeLog(message: string) {
  // Don't block the main thread; fire-and-forget
  fs.promises.appendFile(LOG_FILE, message + '\n').catch(console.error);
}

export async function loggedFetch(
  input: RequestInfo,
  init?: RequestInit & { context?: string },
) {
  const start = Date.now();
  const url = typeof input === 'string' ? input : input.url;
  const context = init?.context || 'unknown';
  try {
    const res = await fetch(input, init);
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}][OUTGOING][${context}] ${url} | ${res.status} | ${duration}ms`;
    writeLog(log);
    return res;
  } catch (err) {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}][OUTGOING][${context}] ${url} | ERROR | ${duration}ms | ${err}`;
    writeLog(log);
    throw err;
  }
}
