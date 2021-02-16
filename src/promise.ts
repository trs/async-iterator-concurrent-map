export interface IdentifiablePromise<T> extends Promise<{value: T, id: number}> {
  id: number;
}

export function makeIdentifiablePromiseMap<T>(promise: Promise<T>, id: number): IdentifiablePromise<T> {
  const result = promise.then((value) => {
    return {
      value,
      id
    }
  });
  (result as any).id = id;

  return result as IdentifiablePromise<T>;
}
