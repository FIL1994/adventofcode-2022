import * as fs from "node:fs";
import * as readline from "node:readline";

async function* processLineByLine(filePath: string) {
  const fileStream = fs.createReadStream(filePath, {
    encoding: "utf8",
  });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (let line of rl) {
    yield line;
  }
}

enum Shape {
  Rock,
  Paper,
  Scissors,
}

const shapeScore = {
  [Shape.Rock]: 1,
  [Shape.Paper]: 2,
  [Shape.Scissors]: 3,
} as const satisfies Record<Shape, number>;

function toShape(char: string) {
  if (["A", "X"].includes(char)) return Shape.Rock;
  if (["B", "Y"].includes(char)) return Shape.Paper;
  if (["C", "Z"].includes(char)) return Shape.Scissors;
}

function outcome(opponentShape: Shape, myShape: Shape) {
  if (opponentShape === myShape) {
    return 3;
  }

  if (
    (opponentShape === Shape.Rock && myShape === Shape.Scissors) ||
    (opponentShape === Shape.Paper && myShape === Shape.Rock) ||
    (opponentShape === Shape.Scissors && myShape === Shape.Paper)
  ) {
    return 0;
  }

  return 6;
}

async function calcScore() {
  let score = 0;

  for await (const line of processLineByLine("./inputs/day2.txt")) {
    const [opponentShape, myShape] = line.split(" ").map(toShape);
    score += shapeScore[myShape];
    score += outcome(opponentShape, myShape);
  }

  return score;
}

// part 1
console.log("total score: ", await calcScore());
