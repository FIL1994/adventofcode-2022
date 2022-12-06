import fs from "node:fs/promises";

const input = await fs.readFile("./inputs/day6.txt", "utf8");

function findDistinctCharsIndex(input, distinctChars) {
  let uniqueChars = [];

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    const idx = uniqueChars.findIndex((c) => c === char);

    if (idx !== -1) {
      uniqueChars = uniqueChars.slice(idx + 1);
    }

    uniqueChars.push(char);

    if (uniqueChars.length === distinctChars) {
      return i + 1;
    }
  }
}

console.log("start of packet: ", findDistinctCharsIndex(input, 4));

console.log("start of message: ", findDistinctCharsIndex(input, 14));
