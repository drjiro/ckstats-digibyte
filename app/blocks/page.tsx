export const revalidate = 60;

import Link from 'next/link';

import { getBlocks } from '../../lib/api';
import { serializeData } from '../../utils/helpers';

const COIN_DECIMALS = 1e8;

function formatReward(satoshis: string | number): string {
  return (Number(satoshis) / COIN_DECIMALS).toFixed(4);
}

function formatHash(hash: string): string {
  return hash.slice(0, 12) + '...' + hash.slice(-8);
}

export default async function BlocksPage() {
  const blocksORM = await getBlocks(100);
  const blocks = serializeData(blocksORM);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center gap-4 mb-4">
        <Link href="/" className="btn btn-ghost btn-sm">
          ← Back
        </Link>
        <h1 className="text-2xl font-bold">Found Blocks</h1>
        <span className="badge badge-primary">{blocks.length}</span>
      </div>

      {blocks.length === 0 ? (
        <div className="alert alert-info">
          No blocks found yet. Run{' '}
          <code className="font-mono">pnpm import-blocks</code> to import from
          logs.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-sm sm:table-md">
            <thead>
              <tr>
                <th>Height</th>
                <th>Block Hash</th>
                <th>Miner</th>
                <th>Worker</th>
                <th>Reward (DGB)</th>
                <th>Difficulty</th>
                <th>Mined At</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block: any) => (
                <tr key={block.id} className="hover">
                  <td className="font-mono font-bold text-primary">
                    {block.height.toLocaleString()}
                  </td>
                  <td className="font-mono text-xs">
                    <span title={block.blockhash}>
                      {formatHash(block.blockhash)}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/users/${block.username}`}
                      className="link text-accent font-mono text-xs"
                    >
                      {block.username.slice(0, 8)}...{block.username.slice(-6)}
                    </Link>
                  </td>
                  <td className="font-mono text-xs">
                    {block.workername.includes('.')
                      ? block.workername.split('.')[1]
                      : block.workername}
                  </td>
                  <td className="text-success font-bold">
                    {formatReward(block.reward)}
                  </td>
                  <td className="font-mono text-xs">
                    {(block.diff / 1e9).toFixed(3)}G
                  </td>
                  <td className="text-xs">
                    {new Date(block.minedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
