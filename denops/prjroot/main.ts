import type { Denops } from "https://deno.land/x/denops_std@v5.0.1/mod.ts";
import { walk } from "https://deno.land/std@0.200.0/fs/walk.ts";

export async function main(denops: Denops): Promise<void> {
  denops.dispatcher = {
    async isInPrj(keyFile: unknown): Promise<boolean> {
      if (typeof keyFile !== 'string') {
        throw new Error(
          `'keyFile' attribute of 'isInPrj' in must be a string`,
        );
      }

      const home = Deno.env.get("HOME") as string;
      let currentDir = await denops.call("expand", "%:p:h") as string;

      while (true) {
        const files = await getFiles(currentDir);
        if (files.includes(keyFile)) {
          return true; 
        }

        if (home === currentDir) break;

        const parsedCurrentDir = currentDir.split('/');
        currentDir = parsedCurrentDir.slice(0, parsedCurrentDir.length - 1).join('/');
      }

      return false;
    },
  };
}

async function getFiles(path: string): Promise<string[]> {
  const fileNames: string[] = [];

  const files = walk(path, { maxDepth: 1 });

  for await (const file of files) {
    fileNames.push(file.name);
  }

  return fileNames;
}
