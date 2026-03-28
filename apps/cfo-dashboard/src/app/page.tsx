// import React from 'react';

// // Mock Data representing parsed Anchor Events from Solana
// const transactions = [
//   { id: 1, date: '2026-03-28', recipient: '0x74a...3f2', amount: '2,500.00', asset: 'instUSD', category: 'Payroll', tax: '375.00', status: 'Compliant' },
//   { id: 2, date: '2026-03-27', recipient: '0x92b...1a9', amount: '1,200.00', asset: 'instUSD', category: 'Vendor', tax: '0.00', status: 'Compliant' },
//   { id: 3, date: '2026-03-26', recipient: '0x44c...8e1', amount: '450.00', asset: 'instUSD', category: 'Software SaaS', tax: '0.00', status: 'Compliant' },
// ];

// export default function CFODashboard() {
//   return (
//     <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans">
//       <nav className="border-b border-gray-200 bg-white px-8 py-4 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <div className="w-8 h-8 bg-[#111827] rounded-md flex items-center justify-center text-white font-bold">I</div>
//           <span className="text-xl font-semibold tracking-tight">Institutional Ledger</span>
//         </div>
//         <div className="flex gap-4 items-center">
//           <span className="text-sm font-medium bg-gray-100 text-gray-600 px-3 py-1 rounded-full">Network: Solana Devnet</span>
//           <button className="bg-[#111827] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
//             Export to CSV
//           </button>
//         </div>
//       </nav>

//       <main className="max-w-6xl mx-auto py-12 px-6">
//         <header className="mb-10">
//           <h1 className="text-3xl font-bold tracking-tight">Financial Operations</h1>
//           <p className="text-gray-500 mt-2">Audit-ready instUSD transactions with cryptographic context.</p>
//         </header>

//         <div className="grid grid-cols-3 gap-6 mb-10">
//           {[
//             { label: 'Total Volume (30d)', value: '4,150.00 instUSD' },
//             { label: 'Est. Tax Liability', value: '375.00 instUSD' },
//             { label: 'Compliance Protocol', value: 'Active', color: 'text-emerald-600' }
//           ].map((stat, i) => (
//             <div key={i} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
//               <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
//               <p className={`text-2xl font-bold mt-2 ${stat.color || ''}`}>{stat.value}</p>
//             </div>
//           ))}
//         </div>

//         <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
//           <table className="w-full text-left border-collapse">
//             <thead className="bg-[#F9FAFB] border-b border-gray-200">
//               <tr>
//                 <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Date</th>
//                 <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Recipient</th>
//                 <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Category</th>
//                 <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Amount</th>
//                 <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Tax Est.</th>
//                 <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase text-right">Status</th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {transactions.map((tx) => (
//                 <tr key={tx.id} className="hover:bg-gray-50 transition">
//                   <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
//                   <td className="px-6 py-4 text-sm font-mono text-gray-400">{tx.recipient}</td>
//                   <td className="px-6 py-4">
//                     <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium border border-gray-200">
//                       {tx.category}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm font-semibold">{tx.amount} <span className="text-gray-500 font-normal">{tx.asset}</span></td>
//                   <td className="px-6 py-4 text-sm text-gray-500">{tx.tax}</td>
//                   <td className="px-6 py-4 text-right">
//                     <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wide">
//                       <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
//                       {tx.status}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </main>
//     </div>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

// Mirrors the on-chain CompliantTransferEvent emitted by the Anchor program
interface CompliantTransferEvent {
  id: number;
  timestamp: string;          // unix_timestamp formatted
  sender: string;             // Pubkey
  receiver: string;           // Pubkey
  amount: number;             // raw u64 (in USDC micro-units, displayed as human)
  category: string;
  senderTax: number;
  receiverTax: number;
  senderRegion: string;
  receiverRegion: string;
  signature: string;
  status: 'Compliant' | 'Blocked';
}

// ─── Mock Data (parsed Anchor CompliantTransferEvents) ───────────────────────

const events: CompliantTransferEvent[] = [
  {
    id: 1,
    timestamp: '2026-03-28 14:32:10',
    sender: '9xKL...mPqR',
    receiver: '0x74a...3f2',
    amount: 2500,
    category: 'Salary',
    senderTax: 125,       // 5% of 2500
    receiverTax: 250,     // 10% of 2500
    senderRegion: 'US',
    receiverRegion: 'IN',
    signature: '5Yk7...hQ2z',
    status: 'Compliant',
  },
  {
    id: 2,
    timestamp: '2026-03-27 09:15:44',
    sender: '9xKL...mPqR',
    receiver: '0x92b...1a9',
    amount: 1200,
    category: 'Vendor',
    senderTax: 0,
    receiverTax: 0,
    senderRegion: 'US',
    receiverRegion: 'IN',
    signature: '3Tm1...jW9p',
    status: 'Compliant',
  },
  {
    id: 3,
    timestamp: '2026-03-26 17:55:02',
    sender: '9xKL...mPqR',
    receiver: '0x44c...8e1',
    amount: 450,
    category: 'SaaS Subscription',
    senderTax: 0,
    receiverTax: 0,
    senderRegion: 'US',
    receiverRegion: 'IN',
    signature: '8Pp4...kR3n',
    status: 'Compliant',
  },
  {
    id: 4,
    timestamp: '2026-03-25 11:20:33',
    sender: '9xKL...mPqR',
    receiver: '7xkx...OFAC',
    amount: 800,
    category: 'Vendor',
    senderTax: 0,
    receiverTax: 0,
    senderRegion: 'US',
    receiverRegion: 'IN',
    signature: '—',
    status: 'Blocked',
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function netAmount(e: CompliantTransferEvent) {
  return e.amount - e.senderTax - e.receiverTax;
}

function totalVolume(list: CompliantTransferEvent[]) {
  return list.filter(e => e.status === 'Compliant').reduce((s, e) => s + e.amount, 0);
}

function totalTax(list: CompliantTransferEvent[]) {
  return list.filter(e => e.status === 'Compliant').reduce((s, e) => s + e.senderTax + e.receiverTax, 0);
}

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'Compliant' | 'Blocked' }) {
  const ok = status === 'Compliant';
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: ok ? '#10b981' : '#ef4444',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: ok ? '#10b981' : '#ef4444',
        display: 'inline-block',
      }} />
      {status}
    </span>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span style={{
      background: '#F3F4F6',
      border: '1px solid #E5E7EB',
      color: '#374151',
      borderRadius: 6,
      padding: '2px 8px',
      fontSize: 11,
      fontWeight: 600,
      fontFamily: 'inherit',
      whiteSpace: 'nowrap',
    }}>
      {label}
    </span>
  );
}

function RegionPair({ from, to }: { from: string; to: string }) {
  return (
    <span style={{ fontSize: 12, color: '#6B7280', fontFamily: "'DM Mono', monospace" }}>
      {from} → {to}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CFODashboard() {
  const [filter, setFilter] = useState<'All' | 'Compliant' | 'Blocked'>('All');

  const filtered = filter === 'All' ? events : events.filter(e => e.status === filter);

  const handleExport = () => {
    const headers = ['Date', 'Sender', 'Receiver', 'Category', 'Amount', 'Sender Tax', 'Receiver Tax', 'Net', 'Sender Region', 'Receiver Region', 'Signature', 'Status'];
    const rows = events.map(e => [
      e.timestamp, e.sender, e.receiver, e.category,
      e.amount, e.senderTax, e.receiverTax, netAmount(e),
      e.senderRegion, e.receiverRegion, e.signature, e.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compliance_events.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F9FAFB',
      color: '#111827',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* ── Nav ── */}
      <nav style={{
        borderBottom: '1px solid #E5E7EB',
        background: '#fff',
        padding: '0 32px',
        height: 60,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, background: '#111827', borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 15,
          }}>I</div>
          <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>
            Institutional Ledger
          </span>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <span style={{
            fontSize: 12, fontWeight: 600,
            background: '#F3F4F6', color: '#6B7280',
            padding: '5px 12px', borderRadius: 999,
          }}>
            Network: Solana Devnet
          </span>
          <button
            onClick={handleExport}
            style={{
              background: '#111827', color: '#fff',
              border: 'none', borderRadius: 8,
              padding: '7px 16px', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Export CSV
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '48px 24px' }}>

        <header style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
            Financial Operations
          </h1>
          <p style={{ color: '#6B7280', marginTop: 6, fontSize: 14 }}>
            Audit-ready instUSD transactions with on-chain cryptographic context.{' '}
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#9CA3AF' }}>
              CompliantTransferEvent
            </span>
          </p>
        </header>

        {/* ── Stat Cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total Volume (30d)', value: `${fmt(totalVolume(events))} USDC` },
            { label: 'Est. Tax Liability', value: `${fmt(totalTax(events))} USDC` },
            { label: 'Transactions', value: `${events.length}` },
            { label: 'Compliance Protocol', value: 'Active', accent: '#10b981' },
          ].map((stat, i) => (
            <div key={i} style={{
              background: '#fff',
              border: '1px solid #E5E7EB',
              borderRadius: 14,
              padding: '20px 22px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, color: '#9CA3AF',
                textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px',
              }}>
                {stat.label}
              </p>
              <p style={{
                fontSize: 22, fontWeight: 700, margin: 0,
                color: stat.accent || '#111827',
                fontFamily: i < 2 ? "'DM Mono', monospace" : 'inherit',
              }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Filter tabs ── */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['All', 'Compliant', 'Blocked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '5px 14px',
                borderRadius: 999,
                border: '1px solid',
                borderColor: filter === f ? '#111827' : '#E5E7EB',
                background: filter === f ? '#111827' : '#fff',
                color: filter === f ? '#fff' : '#6B7280',
                fontFamily: 'inherit',
                fontWeight: 600,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ── Table ── */}
        <div style={{
          background: '#fff',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                {['Timestamp', 'Receiver', 'Category', 'Regions', 'Amount', 'Sender Tax', 'Receiver Tax', 'Net Amount', 'Status'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px',
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.07em',
                    whiteSpace: 'nowrap',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((tx, i) => (
                <tr
                  key={tx.id}
                  style={{
                    borderBottom: i < filtered.length - 1 ? '1px solid #F3F4F6' : 'none',
                    opacity: tx.status === 'Blocked' ? 0.7 : 1,
                  }}
                >
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#6B7280', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
                    {tx.timestamp}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#9CA3AF', fontFamily: "'DM Mono', monospace" }}>
                    {tx.receiver}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Tag label={tx.category} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <RegionPair from={tx.senderRegion} to={tx.receiverRegion} />
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
                    {fmt(tx.amount)} <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: 11 }}>USDC</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#EF4444', fontFamily: "'DM Mono', monospace" }}>
                    {tx.senderTax > 0 ? `−${fmt(tx.senderTax)}` : <span style={{ color: '#9CA3AF' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#EF4444', fontFamily: "'DM Mono', monospace" }}>
                    {tx.receiverTax > 0 ? `−${fmt(tx.receiverTax)}` : <span style={{ color: '#9CA3AF' }}>—</span>}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 700, color: '#111827', fontFamily: "'DM Mono', monospace", whiteSpace: 'nowrap' }}>
                    {tx.status === 'Blocked'
                      ? <span style={{ color: '#9CA3AF' }}>—</span>
                      : <>{fmt(netAmount(tx))} <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: 11 }}>USDC</span></>
                    }
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <StatusBadge status={tx.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Footer note ── */}
        <p style={{ fontSize: 11, color: '#9CA3AF', marginTop: 16, textAlign: 'center' }}>
          Events sourced from on-chain{' '}
          <span style={{ fontFamily: "'DM Mono', monospace" }}>CompliantTransferEvent</span>
          {' '}logs · Anchor Program{' '}
          <span style={{ fontFamily: "'DM Mono', monospace" }}>DMSJPGe...aiSX</span>
        </p>
      </main>
    </div>
  );
}