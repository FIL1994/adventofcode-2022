/**
 * @returns {string}
 */
async function fetchInput() {
  const data = await fetch("https://adventofcode.com/2022/day/1/input", {
    mode: "cors",
    headers: {
      cookie: `session=${process.env.SESSION}`,
    },
  });
  return await data.text();
}

/**
 * @param {string} input
 * @returns {number}
 */
function calcHighest(input) {
  let highest = 0;
  let current = 0;

  for (const calories of input.split("\n")) {
    if (calories === "") {
      if (current > highest) {
        highest = current;
      }
      current = 0;
      continue;
    }

    current += Number(calories);
  }

  return highest;
}

console.log("highest", calcHighest(await fetchInput()));

/**
 * @param {string} input - the input
 * @returns {number}
 */
function top3Elves(input) {
  let top3 = [0, 0, 0];
  let current = 0;

  for (const calories of input.split("\n")) {
    if (calories === "") {
      const index = top3.findIndex((v) => current > v);

      if (index !== -1) {
        top3[index] = current;
      }

      current = 0;
      continue;
    }

    current += Number(calories);
  }

  return top3.reduce((acc, val) => acc + val, 0);
}

console.log("top 3 sum", top3Elves(await fetchInput()));
