import { IdentifiablePromise, makeIdentifiablePromiseMap } from "./promise";

export type MapFunction<T, Y> = (value: T) => Promise<Y>;

export const mapConcurrent = <T, Y>(iterator: AsyncIterator<T>, concurrency: number, fn: MapFunction<T, Y>) => {
  let id = 0;
  let completed = false;
  let working: IdentifiablePromise<IteratorResult<Y, Y>>[] = [];

  const fillWorking = () => {
    while (working.length < concurrency && !completed) {
      working.push(
        makeIdentifiablePromiseMap(iterator.next().then((result) => {
          if (result.done) return {done: true, value: undefined};
          return fn(result.value).then((value) => {
            return {
              done: result.done,
              value
            };
          });
        }), id++)
      )
    }
  };

  const raceWorking = async (): Promise<Y> => {
    const {id, value: {done, value}} = await Promise.race(working);
    working = working.filter((value) => value.id !== id);
    if (done) {
      completed = true;
      return raceWorking();
    }

    return value;
  }

  return {
    async next() {
      fillWorking();

      if (completed && working.length === 0) {
        return {
          done: true,
          value: undefined
        }
      }

      const value = await raceWorking();

      fillWorking();

      return {
        done: false,
        value
      };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
