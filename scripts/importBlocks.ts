import 'dotenv/config';
import 'reflect-metadata';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { getDb } from '../lib/db';
import { Block } from '../lib/entities/Block';

interface BlockLogEntry {
  height: number;
  blockhash: string;
  username: string;
  workername: string;
  reward: number;
  diff: number;
  ntime32: number;
  createcode: string;
}

function parseBlocksFromFile(filePath: string): BlockLogEntry[] {
  const blocks: BlockLogEntry[] = [];
  try {
    const content = readFileSync(filePath, 'utf-8');
    for (const line of content.split('\n')) {
      if (!line.startsWith('block.') || !line.includes('.json=')) continue;
      const jsonStr = line.substring(line.indexOf('=') + 1).trim();
      if (!jsonStr) continue;
      try {
        const data = JSON.parse(jsonStr) as BlockLogEntry;
        // Only import confirmed blocks (block_solve), skip test_blocksolve
        if (data.createcode === 'block_solve') {
          blocks.push(data);
        }
      } catch {
        // skip malformed lines
      }
    }
  } catch {
    // skip unreadable files
  }
  return blocks;
}

async function importBlocks() {
  const logsDir = process.env.API_URL;
  if (!logsDir || logsDir.startsWith('http')) {
    console.log('Block import only supported in file mode (API_URL must be a directory path)');
    return;
  }

  const db = await getDb();
  const blockRepo = db.getRepository(Block);

  const files = readdirSync(logsDir)
    .filter((f) => /^ckdb\d+\.log$/.test(f))
    .sort();

  console.log(`Scanning ${files.length} ckdb log files...`);

  let imported = 0;
  let skipped = 0;

  for (const file of files) {
    const entries = parseBlocksFromFile(join(logsDir, file));
    for (const entry of entries) {
      const existing = await blockRepo.findOne({ where: { height: entry.height } });
      if (existing) {
        skipped++;
        continue;
      }
      await blockRepo.save(
        blockRepo.create({
          height: entry.height,
          blockhash: entry.blockhash,
          username: entry.username,
          workername: entry.workername,
          reward: BigInt(entry.reward),
          diff: entry.diff,
          minedAt: new Date(entry.ntime32 * 1000),
        })
      );
      imported++;
      console.log(`Imported block height=${entry.height} hash=${entry.blockhash.slice(0, 16)}...`);
    }
  }

  console.log(`Done: ${imported} imported, ${skipped} already existed`);
  await db.destroy();
}

importBlocks().catch((e) => {
  console.error(e);
  process.exit(1);
});
