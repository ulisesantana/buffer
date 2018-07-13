import db from './db/db ';
import redisCfg from './config/redis.config';

export function Buffer(s?:number): BufferIterator{
  const size = s || +process.env.BUFFER_SIZE || 3;
  const c = Counter(1);
  const redis = db('redis',redisCfg);
  const bufferKey = process.env.BUFFER_KEY || 'BUFFER_00';

  return {
    async next(obj): Promise<BufferIteratorResponse> {
      try {
        const buffer = [...(await redis.find(bufferKey)) || [], obj];
        await redis.save(bufferKey, buffer);
        if (c.valueOf() < size) {
          c.inc();
          return { done: false }
        } else {
          c.reset();
          await redis.save(bufferKey, '');
          return { done: true, value: [...buffer] }
        }
      } catch (err) {
        throw err;
      }
    }
  }
}

export function Counter(start?: number): Counter{
  start = start || 0;
  let i = start;
  return {
    valueOf: () => i,
    inc: () => { i++ },
    dec: () => { i-- },
    reset: () => { i = start }
  }
}

export interface Counter{
  valueOf(): number,
  inc(): void,
  dec(): void
  reset(): void
}

export interface BufferIteratorResponse {
  done: boolean,
  value?: any[]
}

export interface BufferIterator {
  next(x: any): Promise<BufferIteratorResponse>
}