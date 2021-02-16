# async-iterator-concurrent-map

## Install

```
npm install async-iterator-concurrent-map
```

```
yarn add async-iterator-concurrent-map
```

## Usage

```ts
import { mapConcurrent } from 'async-iterator-concurrent-map';

const concurrentIterator = mapConcurrent(someAsyncGenerator, 10, async (value) => {
  const result = await someIO(value); // Up to 10 of these will run concurrently
  return result;
});

for await (const value of concurrentIterator) {
  // ...
}
```
