import { mapConcurrent } from ".";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

void async function () {
  const gen = async function * () {
    for (const x of Array.from({length: 100}, (_, i) => i)) {
      yield x;
    }
  }

  const iter = mapConcurrent(gen(), 3, async (i) => {
    console.log('map', i)
    await sleep(Math.random() * 100);
    return i;
  });

  let count = 0;
  for await (const value of iter) {
    console.log('loop', value);
    count++;
  }
  console.log({count})
}();
