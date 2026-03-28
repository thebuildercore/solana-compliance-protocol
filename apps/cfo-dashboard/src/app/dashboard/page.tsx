
// 'use client';

// import React, { useState, useEffect } from 'react';

// // ─── Types ────────────────────────────────────────────────────────────────────

// // Mirrors the on-chain CompliantTransferEvent emitted by the Anchor program
// interface CompliantTransferEvent {
//   id: number;
//   timestamp: string;          // unix_timestamp formatted
//   sender: string;             // Pubkey
//   receiver: string;           // Pubkey
//   amount: number;             // raw u64 (in USDC micro-units, displayed as human)
//   category: string;
//   senderTax: number;
//   receiverTax: number;
//   senderRegion: string;
//   receiverRegion: string;
//   signature: string;
//   status: 'Compliant' | 'Blocked';
// }

// // ─── Mock Data (parsed Anchor CompliantTransferEvents) ───────────────────────

// const events: CompliantTransferEvent[] = [
//   {
//     id: 1,
//     timestamp: '2026-03-28 14:32:10',
//     sender: '9xKL...mPqR',
//     receiver: '0x74a...3f2',
//     amount: 2500,
//     category: 'Salary',
//     senderTax: 125,       // 5% of 2500
//     receiverTax: 250,     // 10% of 2500
//     senderRegion: 'US',
//     receiverRegion: 'IN',
//     signature: '5Yk7...hQ2z',
//     status: 'Compliant',
//   },
//   {
//     id: 2,
//     timestamp: '2026-03-27 09:15:44',
//     sender: '9xKL...mPqR',
//     receiver: '0x92b...1a9',
//     amount: 1200,
//     category: 'Vendor',
//     senderTax: 0,
//     receiverTax: 0,
//     senderRegion: 'US',
//     receiverRegion: 'IN',
//     signature: '3Tm1...jW9p',
//     status: 'Compliant',
//   },
//   {
//     id: 3,
//     timestamp: '2026-03-26 17:55:02',
//     sender: '9xKL...mPqR',
//     receiver: '0x44c...8e1',
//     amount: 450,
//     category: 'SaaS Subscription',
//     senderTax: 0,
//     receiverTax: 0,
//     senderRegion: 'US',
//     receiverRegion: 'IN',
//     signature: '8Pp4...kR3n',
//     status: 'Compliant',
//   },
//   {
//     id: 4,
//     timestamp: '2026-03-25 11:20:33',
//     sender: '9xKL...mPqR',
//     receiver: '7xkx...OFAC',
//     amount: 800,
//     category: 'Vendor',
//     senderTax: 0,
//     receiverTax: 0,
//     senderRegion: 'US',
//     receiverRegion: 'IN',
//     signature: '—',
//     status: 'Blocked',
//   },
// ];

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// function netAmount(e: CompliantTransferEvent) {
//   return e.amount - e.senderTax - e.receiverTax;
// }

// function totalVolume(list: CompliantTransferEvent[]) {
//   return list.filter(e => e.status === 'Compliant').reduce((s, e) => s + e.amount, 0);
// }

// function totalTax(list: CompliantTransferEvent[]) {
//   return list.filter(e => e.status === 'Compliant').reduce((s, e) => s + e.senderTax + e.receiverTax, 0);
// }

// function fmt(n: number) {
//   return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// }

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function StatusBadge({ status }: { status: 'Compliant' | 'Blocked' }) {
//   const ok = status === 'Compliant';
//   return (
//     <span style={{
//       display: 'inline-flex',
//       alignItems: 'center',
//       gap: 5,
//       fontSize: 10,
//       fontWeight: 700,
//       letterSpacing: '0.08em',
//       textTransform: 'uppercase',
//       color: ok ? '#10b981' : '#ef4444',
//     }}>
//       <span style={{
//         width: 6, height: 6, borderRadius: '50%',
//         background: ok ? '#10b981' : '#ef4444',
//         display: 'inline-block',
//       }} />
//       {status}
//     </span>
//   );
// }

// function Tag({ label }: { label: string }) {
//   return (
//     <span style={{
//       background: '#F3F4F6',
//       border: '1px solid #E5E7EB',
//       color: '#374151',
//       borderRadius: 6,
//       padding: '2px 8px',
//       fontSize: 11,
//       fontWeight: 600,
//       fontFamily: 'inherit',
//       whiteSpace: 'nowrap',
//     }}>
//       {label}
//     </span>
//   );
// }

// function RegionPair({ from, to }: { from: string; to: string }) {
//   return (
//     <span style={{ fontSize: 12, color: '#6B7280', fontFamily: "'DM Mono', monospace" }}>
//       {from} → {to}
//     </span>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function CFODashboard() {
//   const [filter, setFilter] = useState<'All' | 'Compliant' | 'Blocked'>('All');

//   const filtered = filter === 'All' ? events : events.filter(e => e.status === filter);

//   const handleExport = () => {
//     const headers = ['Date', 'Sender', 'Receiver', 'Category', 'Amount', 'Sender Tax', 'Receiver Tax', 'Net', 'Sender Region', 'Receiver Region', 'Signature', 'Status'];
//     const rows = events.map(e => [
//       e.timestamp, e.sender, e.receiver, e.category,
//       e.amount, e.senderTax, e.receiverTax, netAmount(e),
//       e.senderRegion, e.receiverRegion, e.signature, e.status,
//     ]);
//     const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
//     const blob = new Blob([csv], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url; a.download = 'compliance_events.csv'; a.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: '#F9FAFB',
//       color: '#111827',
//       fontFamily: "'DM Sans', sans-serif",
//     }}>
//       <link
//         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
//         rel="stylesheet"
//       />

//       {/* ── Nav ── */}
//       <nav style={{
//         borderBottom: '1px solid #E5E7EB',
//         background: '#fff',
//         padding: '0 32px',
//         height: 60,
//         display: 'flex',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//       }}>
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <div style={{
//             width: 32, height: 32, background: '#111827', borderRadius: 8,
//             display: 'flex', alignItems: 'center', justifyContent: 'center',
//             color: '#fff', fontWeight: 700, fontSize: 15,
//           }}>I</div>
//           <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>
//             Institutional Ledger
//           </span>
//         </div>
//         <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
//           <span style={{
//             fontSize: 12, fontWeight: 600,
//             background: '#F3F4F6', color: '#6B7280',
//             padding: '5px 12px', borderRadius: 999,
//           }}>
//             Network: Solana Devnet
//           </span>
//           <button
//             onClick={handleExport}
//             style={{
//               background: '#111827', color: '#fff',
//               border: 'none', borderRadius: 8,
//               padding: '7px 16px', fontSize: 12, fontWeight: 700,
//               cursor: 'pointer', fontFamily: 'inherit',
//             }}
//           >
//             Export CSV
//           </button>
//         </div>
//       </nav>

//       {/* ── Main ── */}
//       <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

//         <header style={{ marginBottom: 36 }}>
//           <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
//             Financial Operations
//           </h1>
//           <p style={{ color: '#6B7280', marginTop: 6, fontSize: 14 }}>
//             Audit-ready instUSD transactions with on-chain cryptographic context.{' '}
//             <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#9CA3AF' }}>
//               CompliantTransferEvent
//             </span>
//           </p>
//         </header>

//         {/* ── Stat Cards ── */}
//         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
//           {[
//             { label: 'Total Volume (30d)', value: `${fmt(totalVolume(events))} USDC` },
//             { label: 'Est. Tax Liability', value: `${fmt(totalTax(events))} USDC` },
//             { label: 'Transactions', value: `${events.length}` },
//             { label: 'Compliance Protocol', value: 'Active', accent: '#10b981' },
//           ].map((stat, i) => (
//             <div key={i} style={{
//               background: '#fff',
//               border: '1px solid #E5E7EB',
//               borderRadius: 14,
//               padding: '20px 22px',
//               boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
//             }}>
//               <p style={{
//                 fontSize: 10, fontWeight: 700, color: '#9CA3AF',
//                 textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px',
//               }}>
//                 {stat.label}
//               </p>
//               <p style={{
//                 fontSize: 22, fontWeight: 700, margin: 0,
//                 color: stat.accent || '#111827',
//                 fontFamily: i < 2 ? "'DM Mono', monospace" : 'inherit',
//               }}>
//                 {stat.value}
//               </p>
//             </div>
//           ))}
//         </div>

//         {/* ── Filter tabs ── */}
//         <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
//           {(['All', 'Compliant', 'Blocked'] as const).map((f) => (
//             <button
//               key={f}
//               onClick={() => setFilter(f)}
//               style={{
//                 padding: '5px 14px',
//                 borderRadius: 999,
//                 border: '1px solid',
//                 borderColor: filter === f ? '#111827' : '#E5E7EB',
//                 background: filter === f ? '#111827' : '#fff',
//                 color: filter === f ? '#fff' : '#6B7280',
//                 fontFamily: 'inherit',
//                 fontWeight: 600,
//                 fontSize: 12,
//                 cursor: 'pointer',
//                 transition: 'all 0.15s',
//               }}
//             >
//               {f}
//             </button>
//           ))}
//         </div>

//         {/* ── Table ── */}
//         <div style={{
//           background: '#fff',
//           border: '1px solid #E5E7EB',
//           borderRadius: 16,
//           overflow: 'hidden',
//           boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
//         }}>
//           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
//             <thead>
//               <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
//                 {['Timestamp', 'Receiver', 'Category', 'Regions', 'Amount', 'Sender Tax', 'Receiver Tax', 'Net Amount', 'Status'].map((h) => (
//                   <th key={h} style={{
//                     padding: '12px 16px',
//                     fontSize: 10,
//                     fontWeight: 700,
//                     color: '#9CA3AF',
//                     textTransform: 'uppercase',
//                     letterSpacing: '0.07em',
//                     whiteSpace: 'nowrap',
//                   }}>
//                     {h}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((tx, i) => (
//                 <tr
//                   key={tx.id}
//                   style={{
//                     borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none',
//                     opacity: tx.status === 'Blocked' ? 0.7 : 1,
//                   }}
//                 >
//                   <td style={{ padding: '14px 16px', fontSize: 12, color: '#6B7280', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
//                     {tx.timestamp}
//                   </td>
//                   <td style={{ padding: '14px 16px', fontSize: 12, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>
//                     {tx.receiver}
//                   </td>
//                   <td style={{ padding: '14px 16px' }}>
//                     <Tag label={tx.category} />
//                   </td>
//                   <td style={{ padding: '14px 16px' }}>
//                     <RegionPair from={tx.senderRegion} to={tx.receiverRegion} />
//                   </td>
//                   <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
//                     {fmt(tx.amount)} <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: 11 }}>USDC</span>
//                   </td>
//                   <td style={{ padding: '14px 16px', fontSize: 12, color: '#EF4444', fontFamily: "'DM Mono', monospace" }}>
//                     {tx.senderTax > 0 ? `−${fmt(tx.senderTax)}` : <span style={{ color: '#9CA3AF' }}>—</span>}
//                   </td>
//                   <td style={{ padding: '14px 16px', fontSize: 12, color: '#EF4444', fontFamily: "'DM Mono', monospace" }}>
//                     {tx.receiverTax > 0 ? `−${fmt(tx.receiverTax)}` : <span style={{ color: '#9CA3AF' }}>—</span>}
//                   </td>
//                   <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
//                     {tx.status === 'Blocked'
//                       ? <span style={{ color: '#9CA3AF' }}>—</span>
//                       : <>{fmt(netAmount(tx))} <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: 11 }}>USDC</span></>
//                     }
//                   </td>
//                   <td style={{ padding: '14px 16px' }}>
//                     <StatusBadge status={tx.status} />
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* ── Footer note ── */}
//         <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 16, textAlign: 'center' }}>
//           Events sourced from on-chain{' '}
//           <span style={{ fontFamily: "'DM Mono', monospace" }}>CompliantTransferEvent</span>
//           {' '}logs · Anchor Program{' '}
//           <span style={{ fontFamily: "'DM Mono', monospace" }}>DMSJPGe...aiSX</span>
//         </p>
//       </main>
//     </div>
//   );
// }

'use client';
import React, { useState, useMemo } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid, Legend,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AccountMeta {
  label: string; address: string; role: string;
}
interface TxEvent {
  id: string; signature: string; slot: number; timestamp: string; blockTime: number;
  sender: string; receiver: string;
  senderTokenAccount: string; receiverTokenAccount: string;
  senderTreasury: string; receiverTreasury: string;
  amount: number; category: string;
  senderTax: number; receiverTax: number;
  senderRegion: string; receiverRegion: string;
  status: 'Compliant' | 'Blocked'; memo: string;
  accounts: AccountMeta[];
}

// ─── Forex rates (mocked, realistic) ─────────────────────────────────────────
const FOREX: Record<string, { symbol: string; rate: number; locale: string; currency: string }> = {
  USD: { symbol: '$',  rate: 1.00,   locale: 'en-US', currency: 'USD' },
  INR: { symbol: '₹',  rate: 83.42,  locale: 'en-IN', currency: 'INR' },
  EUR: { symbol: '€',  rate: 0.924,  locale: 'de-DE', currency: 'EUR' },
  GBP: { symbol: '£',  rate: 0.788,  locale: 'en-GB', currency: 'GBP' },
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const EVENTS: TxEvent[] = [
  {
    id: 'tx-001', signature: '5Yk7hQ2zXmPr3rN8wJdLkT9vBsGnCeF2aY4uQ1oW6pM',
    slot: 318274610, timestamp: '2026-03-28 14:32:10', blockTime: 1743170330,
    sender: 'HZWTVtZhufG7hZPg6B17BmSSvGivppiNmHkEsmLeH9Lh',
    receiver: '6cQkrSyciDbBMDZj5x5ArHTgaqHgV8J74TQy8LwYML28',
    senderTokenAccount: 'H4p9XY2dcdJzaBbh21AU98bM6GFpDirrpjResLogxep6',
    receiverTokenAccount: '9acbQf3WiUgFbNwYv9w4LRuMS66xFbtbQsakX5fiiAqy',
    senderTreasury: 'jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG',
    receiverTreasury: 'BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U',
    amount: 2500, category: 'Salary', senderTax: 125, receiverTax: 250,
    senderRegion: 'US', receiverRegion: 'IN', status: 'Compliant',
    memo: 'Ctx:Salary|Out:125|In:250',
    accounts: [
      { label: 'Sender',                 address: 'HZWTVtZhufG7hZPg6B17BmSSvGivppiNmHkEsmLeH9Lh', role: 'WritableSigner' },
      { label: 'Sender Token Account',   address: 'H4p9XY2dcdJzaBbh21AU98bM6GFpDirrpjResLogxep6', role: 'Writable'       },
      { label: 'Receiver Token Account', address: '9acbQf3WiUgFbNwYv9w4LRuMS66xFbtbQsakX5fiiAqy', role: 'Writable'       },
      { label: 'Receiver',               address: '6cQkrSyciDbBMDZj5x5ArHTgaqHgV8J74TQy8LwYML28', role: 'ReadOnly'        },
      { label: 'Sender Treasury',        address: 'jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG',  role: 'Writable'       },
      { label: 'Receiver Treasury',      address: 'BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U', role: 'Writable'       },
      { label: 'Token Program',          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',  role: 'ReadOnly'        },
    ],
  },
  {
    id: 'tx-002', signature: '3Tm1jW9pKsLvB8xQ2rN4mY7hP5aG6uE0cF3iT9wZnRo',
    slot: 318201445, timestamp: '2026-03-27 09:15:44', blockTime: 1743083744,
    sender: 'HZWTVtZhufG7hZPg6B17BmSSvGivppiNmHkEsmLeH9Lh',
    receiver: 'AqP7mXeNdW2cYtBv5sKjR9hGfL3uZoM8iT1wCnEpVaQ',
    senderTokenAccount: 'H4p9XY2dcdJzaBbh21AU98bM6GFpDirrpjResLogxep6',
    receiverTokenAccount: 'DkR3wY9vNmP2sL7hT5aQ1bX8jG4uE6cF0iV2oZ3tBnW',
    senderTreasury: 'jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG',
    receiverTreasury: 'BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U',
    amount: 1200, category: 'Vendor', senderTax: 0, receiverTax: 0,
    senderRegion: 'US', receiverRegion: 'IN', status: 'Compliant',
    memo: 'Ctx:Vendor|Out:0|In:0',
    accounts: [
      { label: 'Sender',                 address: 'HZWTVtZhufG7hZPg6B17BmSSvGivppiNmHkEsmLeH9Lh', role: 'WritableSigner' },
      { label: 'Sender Token Account',   address: 'H4p9XY2dcdJzaBbh21AU98bM6GFpDirrpjResLogxep6', role: 'Writable'       },
      { label: 'Receiver Token Account', address: 'DkR3wY9vNmP2sL7hT5aQ1bX8jG4uE6cF0iV2oZ3tBnW', role: 'Writable'       },
      { label: 'Receiver',               address: 'AqP7mXeNdW2cYtBv5sKjR9hGfL3uZoM8iT1wCnEpVaQ',  role: 'ReadOnly'       },
      { label: 'Sender Treasury',        address: 'jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG',  role: 'Writable'       },
      { label: 'Receiver Treasury',      address: 'BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U', role: 'Writable'       },
      { label: 'Token Program',          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',  role: 'ReadOnly'       },
    ],
  },
  {
    id: 'tx-003', signature: '8Pp4kR3nWvMs1cT6ySdLqX7aB2jF9uH5eG0iV4wZoNm',
    slot: 318128002, timestamp: '2026-03-26 17:55:02', blockTime: 1743011702,
    sender: 'HZWTVtZhufG7hZPg6B17BmSSvGivppiNmHkEsmLeH9Lh',
    receiver: 'FbN9tK2mQwP6sX4hY7rL1aJ3dG8uE5cV0oZ2iT4wBnR',
    senderTokenAccount: 'H4p9XY2dcdJzaBbh21AU98bM6GFpDirrpjResLogxep6',
    receiverTokenAccount: 'CeS5vB8nMpX3wL6hT9aQ2rY4jG7uF1cE0iV3oZ5tKnW',
    senderTreasury: 'jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG',
    receiverTreasury: 'BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U',
    amount: 450, category: 'SaaS Subscription', senderTax: 0, receiverTax: 0,
    senderRegion: 'US', receiverRegion: 'IN', status: 'Compliant',
    memo: 'Ctx:SaaS Subscription|Out:0|In:0',
    accounts: [
      { label: 'Sender',                 address: 'HZWTVtZhufG7hZPg6B17BmSSvGivppiNmHkEsmLeH9Lh', role: 'WritableSigner' },
      { label: 'Sender Token Account',   address: 'H4p9XY2dcdJzaBbh21AU98bM6GFpDirrpjResLogxep6', role: 'Writable'       },
      { label: 'Receiver Token Account', address: 'CeS5vB8nMpX3wL6hT9aQ2rY4jG7uF1cE0iV3oZ5tKnW', role: 'Writable'       },
      { label: 'Receiver',               address: 'FbN9tK2mQwP6sX4hY7rL1aJ3dG8uE5cV0oZ2iT4wBnR',  role: 'ReadOnly'       },
      { label: 'Sender Treasury',        address: 'jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG',  role: 'Writable'       },
      { label: 'Receiver Treasury',      address: 'BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U', role: 'Writable'       },
      { label: 'Token Program',          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',  role: 'ReadOnly'       },
    ],
  },
  {
    id: 'tx-004', signature: 'BLOCKED_BY_MIDDLEWARE',
    slot: 0, timestamp: '2026-03-25 11:20:33', blockTime: 0,
    sender: 'HZWTVtZhufG7hZPg6B17BmSSvGivppiNmHkEsmLeH9Lh',
    receiver: '7xkxOFACblacklistedWalletXXXXXXXXXXXXXXXXXXX',
    senderTokenAccount: 'H4p9XY2dcdJzaBbh21AU98bM6GFpDirrpjResLogxep6',
    receiverTokenAccount: '—',
    senderTreasury: 'jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG',
    receiverTreasury: 'BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U',
    amount: 800, category: 'Vendor', senderTax: 0, receiverTax: 0,
    senderRegion: 'US', receiverRegion: 'IN', status: 'Blocked',
    memo: 'OFAC violation — rejected before chain submission',
    accounts: [],
  },
  {
    id: 'tx-005', signature: '2Kw9nMpT4rBxV7sJ1hQ3oY6aL8uG5dF0eZ2cN9tRmPk',
    slot: 318055778, timestamp: '2026-03-25 08:04:17', blockTime: 1742900657,
    sender: 'HZWTVtZhufG7hZPg6B17BmSSvGivppiNmHkEsmLeH9Lh',
    receiver: 'BnM4wQ7pKsL9vX2hT5aJ3dG8uE6cF1iV0oZ4rY2tBnW',
    senderTokenAccount: 'H4p9XY2dcdJzaBbh21AU98bM6GFpDirrpjResLogxep6',
    receiverTokenAccount: 'GpK8vM3nQwP5sX1hT4aJ2dL9uE7cF0iV3oZ6tYmBnRs',
    senderTreasury: 'jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG',
    receiverTreasury: 'BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U',
    amount: 3800, category: 'Salary', senderTax: 190, receiverTax: 380,
    senderRegion: 'US', receiverRegion: 'IN', status: 'Compliant',
    memo: 'Ctx:Salary|Out:190|In:380',
    accounts: [
      { label: 'Sender', address: 'HZWTVtZhufG7hZPg6B17BmSSvGivppiNmHkEsmLeH9Lh', role: 'WritableSigner' },
      { label: 'Sender Token Account', address: 'H4p9XY2dcdJzaBbh21AU98bM6GFpDirrpjResLogxep6', role: 'Writable' },
      { label: 'Receiver Token Account', address: 'GpK8vM3nQwP5sX1hT4aJ2dL9uE7cF0iV3oZ6tYmBnRs', role: 'Writable' },
      { label: 'Receiver', address: 'BnM4wQ7pKsL9vX2hT5aJ3dG8uE6cF1iV0oZ4rY2tBnW', role: 'ReadOnly' },
      { label: 'Sender Treasury', address: 'jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG', role: 'Writable' },
      { label: 'Receiver Treasury', address: 'BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U', role: 'Writable' },
      { label: 'Token Program', address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', role: 'ReadOnly' },
    ],
  },
];

const PROGRAM_ID = 'DMSJPGeWdenYtxCxqpEH2Jm9gJTSuacujo9doRDgaiSX';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const short = (a: string, n = 6) => a.length > n * 2 + 3 ? `${a.slice(0, n)}...${a.slice(-n)}` : a;
const fmtCurrency = (usdc: number, fxKey: string) => {
  const fx = FOREX[fxKey] || FOREX['USDC'];
  if (!fx) return `${usdc.toFixed(2)} USDC`;
  const val = usdc * fx.rate;
  if (fxKey === 'USDC') return `${usdc.toFixed(2)} USDC`;
  return new Intl.NumberFormat(fx.locale, { style: 'currency', currency: fx.currency, maximumFractionDigits: 0 }).format(val);
};

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  bg: '#070A0E', surf: '#0C1017', panel: '#101720', panelHi: '#141E2A',
  border: '#1A2736', borderHi: '#223047',
  txt: '#C9D8E8', txtSub: '#4A6480', txtFaint: '#243040',
  accent: '#4D9EFF', accentBg: '#0A1E38',
  green: '#34D058', greenBg: '#081A0D',
  red: '#F85149', redBg: '#1F0808',
  amber: '#F0A030', amberBg: '#1F1000',
  purple: '#A78BFA', purpleBg: '#15103A',
  teal: '#2DD4BF', tealBg: '#08201E',
  mono: "'JetBrains Mono','Fira Code','Courier New',monospace",
  sans: "'Inter',system-ui,sans-serif",
};

// ─── Sankey SVG ───────────────────────────────────────────────────────────────
function SankeyDiagram({ totalAmount, senderTax, receiverTax, fxKey }: {
  totalAmount: number; senderTax: number; receiverTax: number; fxKey: string;
}) {
  const net = totalAmount - senderTax - receiverTax;
  const netH   = Math.round((net / totalAmount) * 120);
  const sTaxH  = Math.round((senderTax / totalAmount) * 120);
  const rTaxH  = Math.round((receiverTax / totalAmount) * 120);

  const leftY = 40;
  const midNetY = 40;
  const midSTaxY = midNetY + netH + 8;
  const midRTaxY = midSTaxY + sTaxH + 8;

  const rightNetY = 40;
  const rightSTaxY = 40;
  const rightRTaxY = 40;

  return (
    <svg width="100%" viewBox="0 0 480 200" style={{ overflow: 'visible' }}>
      {/* Source block */}
      <rect x="20" y={leftY} width="56" height="120" rx="4" fill={T.accent} opacity="0.9" />
      <text x="48" y={leftY - 8} textAnchor="middle" fill={T.txt} fontSize="10" fontFamily={T.mono}>
        {fmtCurrency(totalAmount, fxKey)}
      </text>
      <text x="48" y={leftY + 62} textAnchor="middle" fill="#fff" fontSize="9" fontFamily={T.mono} fontWeight="700">US</text>
      <text x="48" y={leftY + 74} textAnchor="middle" fill="#ffffff99" fontSize="8" fontFamily={T.mono}>Capital</text>

      {/* Net flow path */}
      <path d={`M76 ${leftY} C200 ${leftY}, 200 ${midNetY}, 324 ${midNetY}`}
        fill="none" stroke={T.green} strokeWidth={Math.max(netH * 0.7, 4)} strokeOpacity="0.35" />
      <path d={`M76 ${leftY + 120} C200 ${leftY + 120}, 200 ${midNetY + netH}, 324 ${midNetY + netH}`}
        fill="none" stroke={T.green} strokeWidth="1" strokeOpacity="0.2" />

      {/* Sender tax path */}
      <path d={`M76 ${leftY + netH + 4} C200 ${leftY + netH + 4}, 200 ${midSTaxY}, 324 ${midSTaxY}`}
        fill="none" stroke={T.amber} strokeWidth={Math.max(sTaxH * 0.7, 2)} strokeOpacity="0.35" />

      {/* Receiver tax path */}
      <path d={`M76 ${leftY + netH + sTaxH + 8} C200 ${leftY + netH + sTaxH + 8}, 200 ${midRTaxY}, 324 ${midRTaxY}`}
        fill="none" stroke={T.red} strokeWidth={Math.max(rTaxH * 0.7, 2)} strokeOpacity="0.35" />

      {/* Destination: Net to IN */}
      <rect x="324" y={rightNetY} width="56" height={netH} rx="4" fill={T.green} opacity="0.8" />
      <text x="352" y={rightNetY + netH / 2 + 4} textAnchor="middle" fill="#fff" fontSize="9" fontFamily={T.mono} fontWeight="700">IN Net</text>
      <text x="352" y={rightNetY - 8} textAnchor="middle" fill={T.green} fontSize="9" fontFamily={T.mono}>
        {fmtCurrency(net, fxKey)}
      </text>

      {/* Destination: US Treasury */}
      <rect x="324" y={rightNetY + netH + 6} width="56" height={Math.max(sTaxH, 6)} rx="4" fill={T.amber} opacity="0.8" />
      <text x="352" y={rightNetY + netH + 6 + Math.max(sTaxH, 6) / 2 + 4} textAnchor="middle" fill="#fff" fontSize="8" fontFamily={T.mono}>US Tax</text>
      <text x="352" y={rightNetY + netH + 6 + Math.max(sTaxH, 6) + 14} textAnchor="middle" fill={T.amber} fontSize="9" fontFamily={T.mono}>
        {fmtCurrency(senderTax, fxKey)}
      </text>

      {/* Destination: IN Treasury */}
      <rect x="324" y={rightNetY + netH + Math.max(sTaxH, 6) + 14} width="56" height={Math.max(rTaxH, 8)} rx="4" fill={T.red} opacity="0.7" />
      <text x="352" y={rightNetY + netH + Math.max(sTaxH, 6) + 14 + Math.max(rTaxH, 8) / 2 + 4} textAnchor="middle" fill="#fff" fontSize="8" fontFamily={T.mono}>IN Tax</text>
      <text x="352" y={rightNetY + netH + Math.max(sTaxH, 6) + 14 + Math.max(rTaxH, 8) + 14} textAnchor="middle" fill={T.red} fontSize="9" fontFamily={T.mono}>
        {fmtCurrency(receiverTax, fxKey)}
      </text>

      {/* Legend */}
      <text x="420" y={rightNetY + netH / 2 + 4} fill={T.txtSub} fontSize="9" fontFamily={T.mono}>Recipient</text>
      <text x="420" y={rightNetY + netH + 6 + Math.max(sTaxH, 6) / 2 + 4} fill={T.txtSub} fontSize="9" fontFamily={T.mono}>IRS / US</text>
      <text x="420" y={rightNetY + netH + Math.max(sTaxH, 6) + 18 + Math.max(rTaxH, 8) / 2} fill={T.txtSub} fontSize="9" fontFamily={T.mono}>CBDT / IN</text>
    </svg>
  );
}

// ─── Transaction Drawer ───────────────────────────────────────────────────────
function TxDrawer({ tx, onClose, fxKey }: { tx: TxEvent; onClose: () => void; fxKey: string }) {
  const net = tx.amount - tx.senderTax - tx.receiverTax;
  const totalTax = tx.senderTax + tx.receiverTax;
  const fx = FOREX[fxKey] ?? FOREX['USD'];

  const convRow = (usdc: number, label: string) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 11, color: T.txtSub, fontFamily: T.mono }}>{label}</span>
      <div style={{ textAlign: 'right' as const }}>
        <span style={{ fontSize: 12, fontFamily: T.mono, color: T.txt }}>{usdc.toFixed(2)} USDC</span>
        {fxKey !== 'USDC' && (
          <span style={{ fontSize: 11, fontFamily: T.mono, color: T.amber, marginLeft: 10 }}>
            ≈ {fmtCurrency(usdc, fxKey)}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed' as const, inset: 0, zIndex: 100, display: 'flex', alignItems: 'stretch' }} onClick={onClose}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.75)' }} />
      <div onClick={e => e.stopPropagation()} style={{
        width: 660, background: T.surf, borderLeft: `1px solid ${T.borderHi}`,
        display: 'flex', flexDirection: 'column' as const, overflowY: 'auto' as const,
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '14px 22px', borderBottom: `1px solid ${T.border}`,
          position: 'sticky' as const, top: 0, background: T.surf, zIndex: 1,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <StatusBadge status={tx.status} />
            <span style={{ fontFamily: T.mono, fontSize: 10, color: T.txtSub }}>
              {tx.slot > 0 ? `slot ${tx.slot.toLocaleString()}` : 'not confirmed'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            {tx.status === 'Compliant' && (
              <a href={`https://explorer.solana.com/tx/${tx.signature}?cluster=devnet`} target="_blank" rel="noreferrer"
                style={{ fontSize: 11, color: T.accent, fontFamily: T.mono, textDecoration: 'none' }}>
                Explorer ↗
              </a>
            )}
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.txtSub, cursor: 'pointer', fontSize: 20, lineHeight: 1 }}>×</button>
          </div>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column' as const, gap: 20 }}>
          {/* Sig */}
          <div>
            <Label>Signature</Label>
            <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 6, padding: '10px 14px', fontFamily: T.mono, fontSize: 11, color: tx.status === 'Blocked' ? T.red : T.accent, wordBreak: 'break-all' as const }}>
              {tx.signature}
            </div>
          </div>
          {/* Memo */}
          <div>
            <Label>On-chain memo · MemoSq4 program</Label>
            <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 6, padding: '10px 14px', fontFamily: T.mono, fontSize: 12, color: T.amber }}>
              {tx.memo}
            </div>
          </div>
          {/* Flow numbers */}
          <div>
            <Label>Transfer breakdown {fxKey !== 'USDC' ? `· USDC + ${fxKey}` : ''}</Label>
            <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: '4px 16px' }}>
              {convRow(tx.amount, 'Gross amount')}
              {convRow(tx.senderTax, `Sender tax withheld → US Treasury (5%)`)}
              {convRow(tx.receiverTax, `Receiver tax withheld → IN Treasury (10%)`)}
              {convRow(net, 'Net delivered to receiver')}
            </div>
          </div>
          {/* Sankey */}
          {tx.status === 'Compliant' && tx.amount > 0 && (
            <div>
              <Label>Capital flow visualization</Label>
              <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: '16px 12px' }}>
                <SankeyDiagram totalAmount={tx.amount} senderTax={tx.senderTax} receiverTax={tx.receiverTax} fxKey={fxKey} />
              </div>
            </div>
          )}
          {/* Treasury */}
          <div>
            <Label>Treasury routing · CPI transfers</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: `US Treasury`, addr: tx.senderTreasury, usdc: tx.senderTax, tag: 'IRS / FATCA' },
                { label: `IN Treasury`, addr: tx.receiverTreasury, usdc: tx.receiverTax, tag: 'CBDT / TDS' },
              ].map(t => (
                <div key={t.label} style={{ background: T.panelHi, border: `1px solid ${T.border}`, borderRadius: 6, padding: '12px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 9, color: T.txtSub, fontFamily: T.mono, textTransform: 'uppercase' as const, letterSpacing: '0.1em' }}>{t.label}</span>
                    <span style={{ fontSize: 9, color: T.purple, fontFamily: T.mono, background: T.purpleBg, padding: '1px 5px', borderRadius: 3 }}>{t.tag}</span>
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, marginBottom: 8, wordBreak: 'break-all' as const }}>{t.addr}</div>
                  <div style={{ fontFamily: T.mono, fontSize: 15, fontWeight: 700, color: t.usdc > 0 ? T.amber : T.txtFaint }}>
                    {t.usdc > 0 ? `+${t.usdc.toFixed(2)} USDC` : '0.00 USDC'}
                  </div>
                  {fxKey !== 'USDC' && t.usdc > 0 && (
                    <div style={{ fontFamily: T.mono, fontSize: 11, color: T.amber, opacity: 0.7, marginTop: 3 }}>
                      ≈ {fmtCurrency(t.usdc, fxKey)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* Accounts */}
          {tx.accounts.length > 0 && (
            <div>
              <Label>Account inputs · Solana explorer format</Label>
              <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 140px', padding: '7px 14px', background: T.panelHi, borderBottom: `1px solid ${T.border}`, gap: 10 }}>
                  {['Account', 'Address', 'Permissions'].map(h => (
                    <span key={h} style={{ fontSize: 8, fontWeight: 700, color: T.txtSub, fontFamily: T.mono, textTransform: 'uppercase' as const, letterSpacing: '0.12em' }}>{h}</span>
                  ))}
                </div>
                {tx.accounts.map((acc, i) => (
                  <div key={i} style={{
                    display: 'grid', gridTemplateColumns: '160px 1fr 140px',
                    padding: '9px 14px', gap: 10, alignItems: 'center',
                    borderBottom: i < tx.accounts.length - 1 ? `1px solid ${T.border}` : 'none',
                    background: i % 2 !== 0 ? `${T.panelHi}88` : 'transparent',
                  }}>
                    <span style={{ fontSize: 11, color: T.txt, fontFamily: T.mono }}>{acc.label}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 10, color: T.accent, wordBreak: 'break-all' as const }}>{acc.address}</span>
                    <span style={{ display: 'inline-flex', gap: 4, flexWrap: 'wrap' as const }}>
                      {acc.role.includes('Signer') && <Chip color={T.amber} bg={T.amberBg}>Signer</Chip>}
                      {acc.role.includes('Writable') && <Chip color={T.accent} bg={T.accentBg}>Writable</Chip>}
                      {acc.role === 'ReadOnly' && <Chip color={T.txtSub} bg={T.panel}>Read</Chip>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tiny shared components ───────────────────────────────────────────────────
const Label = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 9, fontWeight: 700, color: T.txtSub, textTransform: 'uppercase' as const, letterSpacing: '0.12em', fontFamily: T.mono, marginBottom: 8 }}>{children}</div>
);
const Chip = ({ children, color, bg }: { children: React.ReactNode; color: string; bg: string }) => (
  <span style={{ display: 'inline-block', padding: '1px 6px', borderRadius: 3, fontSize: 9, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color, background: bg, border: `1px solid ${color}44`, fontFamily: T.mono }}>{children}</span>
);
const StatusBadge = ({ status }: { status: 'Compliant' | 'Blocked' }) => {
  const ok = status === 'Compliant';
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, fontFamily: T.mono, color: ok ? T.green : T.red, background: ok ? T.greenBg : T.redBg, border: `1px solid ${ok ? T.green : T.red}55` }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: ok ? T.green : T.red, boxShadow: `0 0 5px ${ok ? T.green : T.red}`, flexShrink: 0 }} />
      {ok ? 'Compliant' : 'Blocked · OFAC'}
    </span>
  );
};

// ─── Custom chart tooltip ─────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label, fxKey }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.panelHi, border: `1px solid ${T.borderHi}`, borderRadius: 6, padding: '8px 12px', fontFamily: T.mono }}>
      <div style={{ fontSize: 10, color: T.txtSub, marginBottom: 4 }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} style={{ fontSize: 11, color: p.color, marginBottom: 2 }}>
          {p.name}: {fmtCurrency(p.value, fxKey)}
        </div>
      ))}
    </div>
  );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function CFODashboard() {
  const [selected, setSelected] = useState<TxEvent | null>(null);
  const [filter, setFilter] = useState<'All' | 'Compliant' | 'Blocked'>('All');
  const [fxKey, setFxKey] = useState<string>('USDC');
  const [activeTab, setActiveTab] = useState<'volume' | 'tax'>('tax');

  const filtered = filter === 'All' ? EVENTS : EVENTS.filter(e => e.status === filter);
  const compliant = EVENTS.filter(e => e.status === 'Compliant');
  const totalVol  = compliant.reduce((s, e) => s + e.amount, 0);
  const totalSenderTax = compliant.reduce((s, e) => s + e.senderTax, 0);
  const totalReceiverTax = compliant.reduce((s, e) => s + e.receiverTax, 0);
  const totalTax  = totalSenderTax + totalReceiverTax;
  const blockedN  = EVENTS.filter(e => e.status === 'Blocked').length;
  const compRate  = Math.round((compliant.length / EVENTS.length) * 100);

  // Chart data — sorted ascending by date, cumulative tax
  const chartData = useMemo(() => {
    const sorted = [...compliant].sort((a, b) => a.blockTime - b.blockTime);
    let cumTax = 0, cumVol = 0;
    return sorted.map(e => {
      cumTax += e.senderTax + e.receiverTax;
      cumVol += e.amount;
      return {
        date: e.timestamp.slice(5, 10),
        cumTax,
        cumVol,
        senderTax: e.senderTax,
        receiverTax: e.receiverTax,
        vol: e.amount,
      };
    });
  }, []);

  // CSV export
  const handleExport = () => {
    const fx = FOREX[fxKey] ?? FOREX['USD'];
    const conv = (n: number) => fxKey === 'USDC' ? n.toFixed(2) : (n * fx.rate).toFixed(2);
    const unit = fxKey === 'USDC' ? 'USDC' : fxKey;
    const h = ['Timestamp','Signature','Slot','Sender','Receiver','Category',`Amount(${unit})`,`SenderTax(${unit})`,`ReceiverTax(${unit})`,`Net(${unit})`,`TotalTax(${unit})`,'SenderRegion','ReceiverRegion','Status','Memo'];
    const rows = EVENTS.map(e => [
      e.timestamp, e.signature, e.slot, e.sender, e.receiver, e.category,
      conv(e.amount), conv(e.senderTax), conv(e.receiverTax),
      conv(e.amount - e.senderTax - e.receiverTax),
      conv(e.senderTax + e.receiverTax),
      e.senderRegion, e.receiverRegion, e.status, `"${e.memo}"`,
    ]);
    const csv = [h, ...rows].map(r => r.join(',')).join('\n');
    const a = Object.assign(document.createElement('a'), {
      href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
      download: `compliance_ledger_${new Date().toISOString().slice(0, 10)}.csv`,
    });
    a.click();
  };

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.txt, fontFamily: T.sans }}>

      {/* ── Nav ── */}
      <div style={{
        height: 50, background: T.surf, borderBottom: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px', position: 'sticky' as const, top: 0, zIndex: 30,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 26, height: 26, background: T.accent, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>S</div>
          <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '-0.01em' }}>StableCompliance</span>
          <span style={{ color: T.txtFaint, fontSize: 12 }}>/</span>
          <span style={{ fontSize: 12, color: T.txtSub, fontFamily: T.mono }}>CFO Audit Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Forex toggle */}
          <div style={{ display: 'flex', background: T.panel, border: `1px solid ${T.border}`, borderRadius: 6, overflow: 'hidden' }}>
            {Object.keys(FOREX).concat(['USDC']).filter((v, i, a) => a.indexOf(v) === i).map(k => (
              <button key={k} onClick={() => setFxKey(k)} style={{
                padding: '4px 10px', border: 'none', cursor: 'pointer',
                background: fxKey === k ? T.accentBg : 'transparent',
                color: fxKey === k ? T.accent : T.txtSub,
                fontSize: 10, fontFamily: T.mono, fontWeight: 700,
                borderRight: `1px solid ${T.border}`,
                transition: 'all 0.1s',
              }}>{k}</button>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: T.green, fontFamily: T.mono }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, boxShadow: `0 0 6px ${T.green}`, display: 'inline-block' }} />
            Devnet Live
          </div>
          <button onClick={handleExport} style={{
            background: T.greenBg, border: `1px solid ${T.green}66`, color: T.green,
            borderRadius: 6, padding: '5px 14px', fontSize: 11, fontFamily: T.mono,
            cursor: 'pointer', fontWeight: 700, letterSpacing: '0.03em',
          }}>
            ↓ Download Ledger
          </button>
        </div>
      </div>

      {/* ── Body: 2-column asymmetric layout ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 50px)', gap: 0 }}>

        {/* ── LEFT SIDEBAR ── */}
        <div style={{
          background: T.surf, borderRight: `1px solid ${T.border}`,
          padding: '22px 18px', display: 'flex', flexDirection: 'column' as const, gap: 20,
          position: 'sticky' as const, top: 50, height: 'calc(100vh - 50px)', overflowY: 'auto' as const,
        }}>
          <div>
            <Label>Period</Label>
            <div style={{ fontSize: 11, color: T.txtSub, fontFamily: T.mono }}>Mar 25 – Mar 28, 2026</div>
          </div>

          {/* KPI stack */}
          {[
            { label: 'Total Volume', val: fmtCurrency(totalVol, fxKey), sub: `${compliant.length} compliant txns`, color: T.txt },
            { label: 'US Tax Collected', val: fmtCurrency(totalSenderTax, fxKey), sub: 'IRS / FATCA', color: T.amber },
            { label: 'IN Tax Collected', val: fmtCurrency(totalReceiverTax, fxKey), sub: 'CBDT / TDS', color: T.amber },
            { label: 'Total Tax Withheld', val: fmtCurrency(totalTax, fxKey), sub: 'On-chain · immutable', color: T.purple },
            { label: 'Compliance Rate', val: `${compRate}%`, sub: `${blockedN} OFAC block${blockedN !== 1 ? 's' : ''}`, color: T.green },
          ].map(s => (
            <div key={s.label} style={{ padding: '14px 0', borderBottom: `1px solid ${T.border}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: T.txtSub, fontFamily: T.mono, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: s.color, fontFamily: T.mono, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{s.val}</div>
              <div style={{ fontSize: 10, color: T.txtSub, fontFamily: T.mono, marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}

          {/* Sankey overview */}
          <div>
            <Label>Capital flow · all txns</Label>
            <div style={{ background: T.panel, border: `1px solid ${T.border}`, borderRadius: 8, padding: '12px 6px' }}>
              <SankeyDiagram totalAmount={totalVol} senderTax={totalSenderTax} receiverTax={totalReceiverTax} fxKey={fxKey} />
            </div>
          </div>

          {/* Program info */}
          <div style={{ marginTop: 'auto' }}>
            <Label>Anchor program</Label>
            <div style={{ fontFamily: T.mono, fontSize: 9, color: T.txtSub, wordBreak: 'break-all' as const, lineHeight: 1.6 }}>{PROGRAM_ID}</div>
          </div>
        </div>

        {/* ── RIGHT MAIN ── */}
        <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column' as const, gap: 22, overflowY: 'auto' as const }}>

          {/* Charts row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

            {/* Tax yield area chart */}
            <div style={{ background: T.surf, border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 16px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Label>Cumulative tax yield</Label>
                <span style={{ fontSize: 9, color: T.purple, fontFamily: T.mono, background: T.purpleBg, padding: '1px 6px', borderRadius: 3 }}>DELIVER TO IRS / CBDT</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="taxGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={T.purple} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={T.purple} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke={T.txtFaint} tick={{ fill: T.txtSub, fontSize: 9, fontFamily: T.mono }} />
                  <YAxis stroke={T.txtFaint} tick={{ fill: T.txtSub, fontSize: 9, fontFamily: T.mono }} tickFormatter={v => fmtCurrency(v, fxKey).replace(/[^\d.,₹$€£]/g, '').slice(0, 8)} width={55} />
                  <Tooltip content={<ChartTooltip fxKey={fxKey} />} />
                  <Area type="monotone" dataKey="cumTax" name="Cumulative Tax" stroke={T.purple} fill="url(#taxGrad)" strokeWidth={2} dot={{ fill: T.purple, r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Volume bar chart */}
            <div style={{ background: T.surf, border: `1px solid ${T.border}`, borderRadius: 10, padding: '16px 16px 8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <Label>Transfer volume breakdown</Label>
                <span style={{ fontSize: 9, color: T.teal, fontFamily: T.mono, background: T.tealBg, padding: '1px 6px', borderRadius: 3 }}>PER TX</span>
              </div>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={T.txtFaint} vertical={false} />
                  <XAxis dataKey="date" stroke={T.txtFaint} tick={{ fill: T.txtSub, fontSize: 9, fontFamily: T.mono }} />
                  <YAxis stroke={T.txtFaint} tick={{ fill: T.txtSub, fontSize: 9, fontFamily: T.mono }} tickFormatter={v => fmtCurrency(v, fxKey).replace(/[^\d.,₹$€£]/g, '').slice(0, 8)} width={55} />
                  <Tooltip content={<ChartTooltip fxKey={fxKey} />} />
                  <Bar dataKey="senderTax" name="Sender Tax" stackId="a" fill={T.amber} opacity={0.9} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="receiverTax" name="Receiver Tax" stackId="a" fill={T.red} opacity={0.8} radius={[0, 0, 0, 0]} />
                  <Bar dataKey="vol" name="Net Volume" stackId="b" fill={T.teal} opacity={0.35} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Filter + Table */}
          <div style={{ background: T.surf, border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden' }}>
            {/* Table toolbar */}
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '12px 16px', borderBottom: `1px solid ${T.border}`, background: T.panel,
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: T.txt }}>Transaction Ledger</span>
                <span style={{ fontSize: 10, color: T.txtSub, fontFamily: T.mono }}>CompliantTransferEvent · Anchor</span>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                {(['All', 'Compliant', 'Blocked'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding: '3px 10px', borderRadius: 4, cursor: 'pointer',
                    border: `1px solid ${filter === f ? T.accent : T.border}`,
                    background: filter === f ? T.accentBg : 'transparent',
                    color: filter === f ? T.accent : T.txtSub,
                    fontSize: 10, fontFamily: T.mono, transition: 'all 0.1s',
                  }}>{f}</button>
                ))}
              </div>
            </div>

            {/* Column headers */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '130px 80px 150px 150px 110px 100px 90px 90px 120px',
              padding: '8px 16px', borderBottom: `1px solid ${T.border}`, gap: 8,
            }}>
              {['Date', 'Slot', 'Sender', 'Receiver', 'Category', 'Gross', 'Tax', 'Net', 'Status'].map(h => (
                <div key={h} style={{ fontSize: 8, fontWeight: 700, color: T.txtSub, textTransform: 'uppercase' as const, letterSpacing: '0.12em', fontFamily: T.mono }}>{h}</div>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((tx, i) => {
              const net = tx.amount - tx.senderTax - tx.receiverTax;
              const hasTax = (tx.senderTax + tx.receiverTax) > 0;
              return (
                <div key={tx.id}
                  onClick={() => setSelected(tx)}
                  onMouseEnter={e => (e.currentTarget.style.background = T.panelHi)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '130px 80px 150px 150px 110px 100px 90px 90px 120px',
                    padding: '11px 16px', gap: 8, alignItems: 'center',
                    borderBottom: i < filtered.length - 1 ? `1px solid ${T.border}` : 'none',
                    cursor: 'pointer', transition: 'background 0.1s',
                    borderLeft: tx.status === 'Blocked' ? `3px solid ${T.red}` : `3px solid transparent`,
                  }}>
                  <div>
                    <div style={{ fontSize: 11, color: T.txtSub, fontFamily: T.mono }}>{tx.timestamp.split(' ')[0]}</div>
                    <div style={{ fontSize: 10, color: T.txtFaint, fontFamily: T.mono }}>{tx.timestamp.split(' ')[1]}</div>
                  </div>
                  <div style={{ fontSize: 10, color: T.txtFaint, fontFamily: T.mono }}>{tx.slot > 0 ? tx.slot.toLocaleString() : '—'}</div>
                  <div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent }}>{short(tx.sender)}</div>
                    <div style={{ fontSize: 9, color: T.txtFaint, fontFamily: T.mono, marginTop: 1 }}>{tx.senderRegion}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: T.mono, fontSize: 10, color: T.accent }}>{short(tx.receiver)}</div>
                    <div style={{ fontSize: 9, color: T.txtFaint, fontFamily: T.mono, marginTop: 1 }}>{tx.receiverRegion}</div>
                  </div>
                  <div>
                    <Chip color={tx.category === 'Salary' ? T.purple : T.teal} bg={tx.category === 'Salary' ? T.purpleBg : T.tealBg}>{tx.category}</Chip>
                  </div>
                  <div style={{ fontSize: 12, fontFamily: T.mono, color: T.txt, fontWeight: 600 }}>
                    {fmtCurrency(tx.amount, fxKey)}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: T.mono, color: hasTax ? T.red : T.txtFaint }}>
                    {hasTax ? `−${fmtCurrency(tx.senderTax + tx.receiverTax, fxKey)}` : '—'}
                  </div>
                  <div style={{ fontSize: 12, fontFamily: T.mono, color: tx.status === 'Compliant' ? T.txt : T.txtFaint, fontWeight: 600 }}>
                    {tx.status === 'Blocked' ? '—' : fmtCurrency(net, fxKey)}
                  </div>
                  <div><StatusBadge status={tx.status} /></div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 16 }}>
            <span style={{ fontSize: 10, color: T.txtFaint, fontFamily: T.mono }}>
              {filtered.length} event{filtered.length !== 1 ? 's' : ''} · click any row to inspect
            </span>
            <span style={{ fontSize: 10, color: T.txtFaint, fontFamily: T.mono }}>{short(PROGRAM_ID, 10)}</span>
          </div>
        </div>
      </div>

      {selected && <TxDrawer tx={selected} onClose={() => setSelected(null)} fxKey={fxKey} />}
    </div>
  );
}