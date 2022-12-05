async function fetchInput() {
  const data = await fetch("https://adventofcode.com/2022/day/5/input", {
    mode: "cors",
    headers: {
      cookie: `session=${process.env.SESSION}`,
    },
  });
  return await data.text();
}

/**
 * An instruction for moving X number of crates from one stack to another
 * @typedef {{num: number, from: number, to: num}} Instruction
 */

/**
 * @typedef {[string[]]} Crates
 */

/**
 * @param {string} input
 */
function getCratesAndInstructions(input) {
  const inputArray = input.split("\n");

  const emptyLineIndex = inputArray.findIndex((i) => i === "");

  const cratesInput = inputArray.splice(0, emptyLineIndex);
  const instructionsInput = inputArray.splice(1);

  const crateIndexesLine = cratesInput[cratesInput.length - 1];
  /** @type {number[]} */
  const crateIndexes = [];
  for (let i = 0; i < crateIndexesLine.length; i++) {
    const char = crateIndexesLine[i].trim();

    if (char) {
      crateIndexes[parseInt(char)] = i;
    }
  }

  /** @type {Crates} */
  const crates = [];

  cratesInput.pop();

  for (const line of cratesInput) {
    crateIndexes.forEach((crateIdx, idx) => {
      const crateVal = line[crateIdx].trim();

      if (crateVal) {
        crates[idx] ??= [];
        crates[idx].push(line[crateIdx]);
      }
    });
  }

  return {
    instructions: readInstructions(instructionsInput),
    crates,
  };
}

/**
 * @param {string[]} instructionsArray
 * @returns {Instruction[]}
 */
function readInstructions(instructionsArray) {
  const regex = /move (?<num>\d+) from (?<from>\d+) to (?<to>\d+)/;

  const instructions = [];
  for (const instruction of instructionsArray) {
    const results = instruction.match(regex);
    if (results) {
      const { num, from, to } = results.groups;

      instructions.push({
        num: parseInt(num),
        from: parseInt(from),
        to: parseInt(to),
      });
    }
  }

  return instructions;
}

/**
 * @param {Crates} crates
 * @param {Instruction[]} instructions
 */
function moveCrates(crates, instructions) {
  for (const { num, from, to } of instructions) {
    const cratesToMove = crates[from].splice(0, num).reverse();
    crates[to].unshift(...cratesToMove);
  }
  return crates;
}

/**
 * @param {Crates} crates
 */
function topCrates(crates) {
  return crates.map((c) => c[0]).join("");
}

// Part One

({ crates, instructions } = getCratesAndInstructions(await fetchInput()));
moveCrates(crates, instructions);
console.log("top crates", topCrates(crates));

// Part Two
