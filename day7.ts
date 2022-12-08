import { dir } from "node:console";
import * as fs from "node:fs";
import * as readline from "node:readline";

abstract class FSNode {
  readonly name: string;
  parent?: DirNode;

  constructor(name: string) {
    this.name = name;
  }

  abstract isFile(): this is FileNode;
  abstract isDir(): this is DirNode;
  abstract size(): number;

  get path() {
    let str = this.name;

    let curr = this.parent;
    while (curr) {
      str = `${curr.name}/${str}`;
      curr = curr.parent;
    }

    return str;
  }
}

class DirNode extends FSNode {
  readonly descendants: FSNode[] = [];

  isFile() {
    return false;
  }

  isDir() {
    return true;
  }

  size() {
    let size = 0;

    this.descendants.forEach((d) => {
      size += d.size();
    });

    return size;
  }

  get(name: string) {
    let node = this.descendants.find((d) => d.name === name);
    return node;
  }

  add(node: FSNode) {
    const existingNode = this.get(node.name);

    if (!existingNode) {
      node.parent = this;
      this.descendants.push(node);
    } else {
      throw new Error(`${node.name} already exists`);
    }
  }

  *childDirs(): Iterable<DirNode> {
    for (const d of this.descendants) {
      if (d.isDir()) {
        yield* d.childDirs();
        yield d;
      }
    }
  }
}

class FileNode extends FSNode {
  #size: number = 0;

  constructor(name: string, size: number) {
    super(name);
    this.#size = size;
  }

  isFile() {
    return true;
  }

  isDir() {
    return false;
  }

  size() {
    return this.#size;
  }
}

function splitWhitespace(line: string) {
  return line.trim().split(/\s+/);
}

async function parseTree(filePath: string) {
  const fileStream = fs.createReadStream(filePath, {
    encoding: "utf8",
  });

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const rootNode = new DirNode("");
  let currNode = rootNode;

  let lastCommand: string;
  for await (let line of rl) {
    line = line.trim();

    if (line.startsWith("$")) {
      // assume there can be only 1 argument and no flags
      const [command, arg1] = splitWhitespace(line.substring(1));

      switch (command) {
        case "cd": {
          if (arg1 === "..") {
            if (currNode.parent) {
              currNode = currNode.parent;
            } else {
              console.error(`${currNode.toString()} has no parent directory`);
            }
          } else if (arg1 === "/") {
            currNode = rootNode;
          } else {
            const node = currNode.get(arg1);
            if (node) {
              if (node.isDir()) {
                currNode = node;
              }
            } else {
              console.error(`${arg1} not found`);
            }
          }
          break;
        }
        case "ls": {
          break;
        }
        default: {
          console.error(`command "${command}" not recognized`);
          continue;
        }
      }
      lastCommand = command;
    } else {
      if (lastCommand === "ls") {
        const [sizeOrDir, name] = splitWhitespace(line);

        if (sizeOrDir === "dir") {
          currNode.add(new DirNode(name));
        } else {
          const size = parseInt(sizeOrDir, 10);
          currNode.add(new FileNode(name, size));
        }
      }
    }
  }

  return rootNode;
}

function findDirToDelete(rootNode: DirNode) {
  const spaceToFree = 30000000 - (70000000 - node.size());

  let dirToDelete: DirNode;

  for (const dir of rootNode.childDirs()) {
    if (dir.size() > spaceToFree) {
      if (!dirToDelete) {
        dirToDelete = dir;
      } else if (dirToDelete && dir.size() < dirToDelete.size()) {
        dirToDelete = dir;
      }
    }
  }

  return dirToDelete;
}

const node = await parseTree("./inputs/day7.txt");

// part 1
console.log(
  "size of dirs 100000 or less",
  Array.from(node.childDirs())
    .map((d) => d.size())
    .filter((size) => size <= 100000)
    .reduce((acc, curr) => acc + curr, 0)
);

// part 2
console.log("size of dir to delete", findDirToDelete(node).size());
