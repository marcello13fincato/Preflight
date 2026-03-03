import { describe, it, expect, vi } from 'vitest';
import { apiGet, apiPost } from '../../lib/apiClient';

describe('apiClient', () => {
  it('apiGet returns parsed json on success', async () => {
    const fake = { ok: true, json: async () => ({ hello: 'world' }) } as unknown as Response;
    globalThis.fetch = vi.fn(() => Promise.resolve(fake)) as unknown as typeof globalThis.fetch;
    const res = await apiGet('/test');
    expect(res).toEqual({ hello: 'world' });
  });

  it('apiPost sends body and returns parsed json', async () => {
    const fake = { ok: true, json: async () => ({ ok: true }) } as unknown as Response;
    const fetchMock = vi.fn(() => Promise.resolve(fake)) as unknown as typeof globalThis.fetch;
    globalThis.fetch = fetchMock;
    const res = await apiPost('/test', { a: 1 });
    expect(res).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledWith('/test', expect.objectContaining({ method: 'POST' }));
  });
});
