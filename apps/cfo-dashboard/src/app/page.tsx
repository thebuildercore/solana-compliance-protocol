'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg:     '#05080C',
  surf:   '#080C12',
  card:   '#0C1219',
  border: '#152030',
  borderHi: '#1E3050',
  txt:    '#D4E4F4',
  sub:    '#4A6880',
  faint:  '#1A2A3A',
  accent: '#4D9EFF',
  accentDim: '#0A1E38',
  green:  '#34D058',
  greenDim: '#081A0D',
  amber:  '#F0A030',
  amberDim: '#1A0E00',
  purple: '#A78BFA',
  purpleDim: '#15103A',
  red:    '#F85149',
  mono:   "'JetBrains Mono','Fira Code',monospace",
  sans:   "'Inter',system-ui,sans-serif",
};

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, prefix = '', suffix = '' }: { to: number; prefix?: string; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = to / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(timer); }
      else setVal(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [to]);
  return <>{prefix}{val.toLocaleString()}{suffix}</>;
}

// ─── Inline SVG protocol flow diagram ────────────────────────────────────────
function ProtocolFlow() {
  return (
    <svg width="100%" viewBox="0 0 800 220" style={{ overflow: 'visible' }}>
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M2 1L8 5L2 9" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </marker>
      </defs>

      {/* ── Boxes ── */}
      {/* Sender */}
      <rect x="20" y="80" width="120" height="60" rx="8" fill={C.card} stroke={C.accent} strokeWidth="1" />
      <text x="80" y="106" textAnchor="middle" fill={C.accent} fontSize="11" fontFamily={C.mono} fontWeight="700">Sender</text>
      <text x="80" y="122" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>US Entity</text>
      <text x="80" y="135" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>Phantom Wallet</text>

      {/* SDK */}
      <rect x="200" y="60" width="140" height="100" rx="8" fill={C.card} stroke={C.purple} strokeWidth="1" />
      <text x="270" y="92" textAnchor="middle" fill={C.purple} fontSize="11" fontFamily={C.mono} fontWeight="700">Compliance SDK</text>
      <text x="270" y="108" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>OFAC Screening</text>
      <text x="270" y="120" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>Tax Calculation</text>
      <text x="270" y="132" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>Memo Tagging</text>
      <text x="270" y="148" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>TX Construction</text>

      {/* Anchor Program */}
      <rect x="410" y="60" width="140" height="100" rx="8" fill={C.card} stroke={C.green} strokeWidth="1" />
      <text x="480" y="92" textAnchor="middle" fill={C.green} fontSize="11" fontFamily={C.mono} fontWeight="700">Anchor Program</text>
      <text x="480" y="108" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>Mint Validation</text>
      <text x="480" y="120" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>CPI Tax Splits</text>
      <text x="480" y="132" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>Event Emission</text>
      <text x="480" y="148" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>Audit Trail</text>

      {/* Treasuries */}
      <rect x="620" y="20" width="120" height="50" rx="8" fill={C.card} stroke={C.amber} strokeWidth="1" />
      <text x="680" y="42" textAnchor="middle" fill={C.amber} fontSize="11" fontFamily={C.mono} fontWeight="700">US Treasury</text>
      <text x="680" y="57" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>IRS / FATCA</text>

      <rect x="620" y="90" width="120" height="50" rx="8" fill={C.card} stroke={C.amber} strokeWidth="1" />
      <text x="680" y="112" textAnchor="middle" fill={C.amber} fontSize="11" fontFamily={C.mono} fontWeight="700">IN Treasury</text>
      <text x="680" y="127" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>CBDT / TDS</text>

      <rect x="620" y="160" width="120" height="50" rx="8" fill={C.card} stroke={C.green} strokeWidth="1" />
      <text x="680" y="182" textAnchor="middle" fill={C.green} fontSize="11" fontFamily={C.mono} fontWeight="700">Receiver</text>
      <text x="680" y="197" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>IN Entity · ATA</text>

      {/* ── Arrows ── */}
      <line x1="140" y1="110" x2="198" y2="110" stroke={C.accent} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x="170" y="104" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>initiate</text>

      <line x1="340" y1="110" x2="408" y2="110" stroke={C.purple} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x="376" y="104" textAnchor="middle" fill={C.sub} fontSize="9" fontFamily={C.mono}>sign TX</text>

      {/* Program → US Treasury */}
      <path d="M550 90 C580 90, 590 45, 618 45" fill="none" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x="590" y="62" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily={C.mono}>5% sender</text>

      {/* Program → IN Treasury */}
      <line x1="550" y1="115" x2="618" y2="115" stroke={C.amber} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x="584" y="109" textAnchor="middle" fill={C.amber} fontSize="9" fontFamily={C.mono}>10% rcvr</text>

      {/* Program → Receiver */}
      <path d="M550 130 C580 130, 590 185, 618 185" fill="none" stroke={C.green} strokeWidth="1.5" markerEnd="url(#arr)" />
      <text x="596" y="162" textAnchor="middle" fill={C.green} fontSize="9" fontFamily={C.mono}>net</text>
    </svg>
  );
}

// ─── Components ───────────────────────────────────────────────────────────────
const Tag = ({ children, color = C.sub, bg = C.card }: any) => (
  <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color, background: bg, border: `1px solid ${color}44`, fontFamily: C.mono }}>{children}</span>
);

const FeatureCard = ({ icon, title, desc, tag, tagColor = C.accent, tagBg = C.accentDim }: any) => (
  <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 22px', display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
    <div style={{ fontSize: 22 }}>{icon}</div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
      <span style={{ fontWeight: 600, fontSize: 14, color: C.txt }}>{title}</span>
      {tag && <Tag color={tagColor} bg={tagBg}>{tag}</Tag>}
    </div>
    <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.6, margin: 0 }}>{desc}</p>
  </div>
);

const CompareRow = ({ label, legacy, stable }: { label: string; legacy: string; stable: string }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, fontSize: 13 }}>
    <div style={{ padding: '12px 16px', color: C.sub, background: C.card, borderBottom: `1px solid ${C.border}` }}>{label}</div>
    <div style={{ padding: '12px 16px', color: C.red, background: C.card, borderBottom: `1px solid ${C.border}` }}>{legacy}</div>
    <div style={{ padding: '12px 16px', color: C.green, background: C.card, borderBottom: `1px solid ${C.border}`, fontWeight: 600 }}>{stable}</div>
  </div>
);

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const h = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <div style={{ background: C.bg, color: C.txt, fontFamily: C.sans, minHeight: '100vh' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'fixed' as const, top: 0, left: 0, right: 0, zIndex: 50,
        height: 56,
        background: navScrolled ? `${C.surf}EE` : 'transparent',
        borderBottom: navScrolled ? `1px solid ${C.border}` : '1px solid transparent',
        backdropFilter: navScrolled ? 'blur(12px)' : 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
        transition: 'all 0.2s',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: C.accent, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff' }}>S</div>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.01em' }}>StableCompliance</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          {['Protocol', 'Architecture', 'Use Cases', 'Docs'].map(l => (
            <a key={l} href="#" style={{ fontSize: 13, color: C.sub, textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="#" style={{ fontSize: 12, fontWeight: 600, color: C.accent, textDecoration: 'none', padding: '6px 16px', border: `1px solid ${C.accent}44`, borderRadius: 6, background: C.accentDim }}>Launch App</a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column' as const,
        alignItems: 'center', justifyContent: 'center', textAlign: 'center' as const,
        padding: '100px 48px 60px', position: 'relative' as const, overflow: 'hidden',
      }}>
        {/* Grid bg */}
        <div style={{
          position: 'absolute' as const, inset: 0, zIndex: 0,
          backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
          backgroundSize: '60px 60px', opacity: 0.3,
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute' as const, top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: `radial-gradient(ellipse, ${C.accent}18 0%, transparent 70%)`,
          zIndex: 0,
        }} />

        <div style={{ position: 'relative' as const, zIndex: 1, maxWidth: 860 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '6px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 999 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.green, boxShadow: `0 0 6px ${C.green}`, display: 'inline-block' }} />
            <span style={{ fontSize: 12, color: C.sub, fontFamily: C.mono }}>Solana Devnet · Anchor Protocol · instUSD</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.04em', margin: '0 0 24px',
            background: `linear-gradient(135deg, ${C.txt} 30%, ${C.sub} 100%)`,
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Compliant Cross-Border<br />Payments on Solana
          </h1>

          <p style={{ fontSize: 18, color: C.sub, lineHeight: 1.65, maxWidth: 640, margin: '0 auto 36px' }}>
            The first on-chain compliance middleware for institutional stablecoin transfers. Automatic tax withholding, OFAC screening, and cryptographic audit trails — all enforced at the smart contract level.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const, marginBottom: 48 }}>
            {/* <a href="#" style={{ fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '12px 28px', background: C.accent, borderRadius: 8, letterSpacing: '-0.01em' }}>
              View Dashboard
            </a> */}
            <a href="https://YOUR_WALLET_VERCEL_URL" target="_blank" rel="noreferrer" style={{ fontSize: 12, fontWeight: 600, color: C.txt, textDecoration: 'none', padding: '6px 16px', border: `1px solid ${C.borderHi}`, borderRadius: 6, background: C.card }}>Wallet ↗</a>
          <Link href="/dashboard" style={{ fontSize: 12, fontWeight: 600, color: C.accent, textDecoration: 'none', padding: '6px 16px', border: `1px solid ${C.accent}44`, borderRadius: 6, background: C.accentDim }}>CFO Dashboard</Link>

            <a href="#" style={{ fontSize: 14, fontWeight: 600, color: C.txt, textDecoration: 'none', padding: '12px 28px', border: `1px solid ${C.borderHi}`, borderRadius: 8, background: C.card }}>
              Read the Docs →
            </a>
          </div>

          {/* Live stat pills */}
          <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            {[
              { val: <Counter to={4150} prefix="$" suffix=" USDC" />, label: 'Volume settled on-chain' },
              { val: <Counter to={375} prefix="$" suffix=" USDC" />, label: 'Tax withheld · IRS + CBDT' },
              { val: <Counter to={100} suffix="%" />, label: 'OFAC compliance rate' },
              { val: '< 0.4s', label: 'Settlement finality' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center' as const }}>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: C.mono, color: C.txt, letterSpacing: '-0.03em' }}>{s.val}</div>
                <div style={{ fontSize: 11, color: C.sub, fontFamily: C.mono, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Problem / Solution ── */}
      <section style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <Tag color={C.red} >The Problem</Tag>
            <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', margin: '16px 0 20px', lineHeight: 1.15 }}>
              $150 trillion in annual cross-border flows — zero on-chain compliance
            </h2>
            <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.7, margin: '0 0 16px' }}>
              Every international stablecoin transfer today is a compliance black box. Financial institutions route payments through correspondent banking networks that can take 3–5 days, charge 2–7% in fees, and produce paper audit trails that require manual reconciliation for tax filings under FATCA, FBAR, TDS, and GST frameworks.
            </p>
            <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.7 }}>
              There is no programmable mechanism to embed <strong style={{ color: C.txt }}>withholding tax</strong>, <strong style={{ color: C.txt }}>KYC/AML context</strong>, or <strong style={{ color: C.txt }}>OFAC sanction screening</strong> at the transaction layer — until now.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
            {[
              { icon: '⏳', t: '3–5 day settlement via SWIFT', sub: 'Correspondent banking latency' },
              { icon: '💸', t: '2–7% transfer fees', sub: 'FOREX spread + correspondent markup' },
              { icon: '📄', t: 'Manual tax reconciliation', sub: 'FATCA, TDS, FBAR filings by hand' },
              { icon: '🚫', t: 'No programmatic OFAC screening', sub: 'Reactive compliance, post-settlement' },
              { icon: '🔍', t: 'Opaque audit trails', sub: 'No cryptographic proof of compliance' },
            ].map(p => (
              <div key={p.t} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 16px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <span style={{ fontSize: 16, marginTop: 1 }}>{p.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.txt, marginBottom: 2 }}>{p.t}</div>
                  <div style={{ fontSize: 12, color: C.sub }}>{p.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Protocol Architecture ── */}
      <section style={{ padding: '80px 48px', background: C.surf, borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
            <Tag color={C.purple} bg={C.purpleDim}>Architecture</Tag>
            <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', margin: '16px 0 12px' }}>
              Three-layer compliance protocol
            </h2>
            <p style={{ fontSize: 15, color: C.sub, maxWidth: 540, margin: '0 auto' }}>
              Off-chain screening middleware + on-chain enforcement + immutable audit events. Compliance is not an afterthought — it is the transaction.
            </p>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: '28px 24px' }}>
            <ProtocolFlow />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 20 }}>
            {[
              { n: '01', title: 'SDK Middleware', color: C.purple, items: ['OFAC/SDN list screening', 'Bilateral tax computation', 'Transaction context tagging', 'Solana TX construction'] },
              { n: '02', title: 'Anchor Smart Contract', color: C.green, items: ['Mint & ownership validation', 'Atomic 3-way CPI split', 'MathOverflow protection', 'CompliantTransferEvent'] },
              { n: '03', title: 'Treasury Routing', color: C.amber, items: ['US Treasury ATA (IRS/FATCA)', 'IN Treasury ATA (CBDT/TDS)', 'Jurisdiction-aware disbursement', 'Immutable on-chain receipts'] },
            ].map(l => (
              <div key={l.n} style={{ background: C.surf, border: `1px solid ${C.border}`, borderRadius: 10, padding: '18px 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 10, fontFamily: C.mono, color: l.color, fontWeight: 700 }}>{l.n}</span>
                  <span style={{ fontWeight: 600, fontSize: 13, color: l.color }}>{l.title}</span>
                </div>
                {l.items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: `1px solid ${C.border}` }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: l.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: C.sub }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ padding: '80px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 48 }}>
          <Tag color={C.accent} bg={C.accentDim}>Features</Tag>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', margin: '16px 0 12px' }}>
            Built for institutional-grade compliance
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          <FeatureCard icon="🛡️" title="Real-Time OFAC Screening" tag="AML" tagColor={C.red} 
            desc="Every transaction is pre-screened against the OFAC SDN list before hitting the Solana network. Blocked addresses are rejected at the middleware layer with a logged audit event — zero chain gas wasted on non-compliant transfers." />
          <FeatureCard icon="🧾" title="Programmable Tax Withholding" tag="Tax" tagColor={C.amber} tagBg={C.amberDim}
            desc="Sender-side and receiver-side withholding taxes are computed off-chain, enforced on-chain via CPI, and routed to jurisdiction-specific treasury accounts — fully analogous to TDS under Section 195 of the Indian Income Tax Act and FATCA reporting obligations." />
          <FeatureCard icon="🔗" title="Cryptographic Audit Trail" tag="Audit" tagColor={C.purple} tagBg={C.purpleDim}
            desc="The Anchor program emits a CompliantTransferEvent on every successful transfer, permanently recording: sender, receiver, category, tax amounts, regions, and block timestamp. Immutable. Verifiable. Auditor-ready." />
          <FeatureCard icon="📊" title="CFO Dashboard + CSV Export" tag="Reporting" tagColor={C.green} tagBg={C.greenDim}
            desc="One-click ledger export formats your entire transaction history as a CSV structured for IRS Schedule B, Form 1042-S (US), or Form 26Q (India). Hand it to your tax authority and walk away." />
          <FeatureCard icon="💱" title="Live Fiat Conversion" tag="Multi-currency"
            desc="Every USDC value on the dashboard converts in real-time to USD, INR, EUR, or GBP using live forex rates. US tax collected shows as $125 USD. IN tax shows as ₹10,428 INR. The cross-border narrative is immediately apparent." />
          <FeatureCard icon="⚡" title="Sub-Second Finality" tag="Solana"
            desc="Settlement is final in under 400ms on Solana — versus 3–5 business days on SWIFT. No correspondent banking delays, no nostro/vostro account pre-funding, no cut-off windows. The cross-border payment is atomic." />
        </div>
      </section>

      {/* ── Comparison table ── */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 36 }}>
          <Tag color={ C.green} bg={C.card}>Comparison</Tag>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', margin: '16px 0 0' }}>
            StableCompliance vs. Legacy Rails
          </h2>
        </div>
        <div style={{ border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: C.card }}>
            <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: C.sub, fontFamily: C.mono, textTransform: 'uppercase' as const, letterSpacing: '0.1em', borderBottom: `1px solid ${C.border}` }}>Capability</div>
            <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: C.red, fontFamily: C.mono, textTransform: 'uppercase' as const, letterSpacing: '0.1em', borderBottom: `1px solid ${C.border}` }}>Legacy / SWIFT</div>
            <div style={{ padding: '12px 16px', fontSize: 11, fontWeight: 700, color: C.green, fontFamily: C.mono, textTransform: 'uppercase' as const, letterSpacing: '0.1em', borderBottom: `1px solid ${C.border}` }}>StableCompliance</div>
          </div>
          <CompareRow label="Settlement time" legacy="3–5 business days" stable="< 400ms final" />
          <CompareRow label="Transfer cost" legacy="2–7% (FX + fees)" stable="~$0.0003 Solana fee" />
          <CompareRow label="OFAC screening" legacy="Manual / batch (T+1)" stable="Real-time, pre-chain" />
          <CompareRow label="Tax withholding" legacy="Manual IRS / CBDT filings" stable="Automatic, on-chain CPI" />
          <CompareRow label="Audit trail" legacy="PDF statements, 90-day reconciliation" stable="Immutable on-chain event, instant" />
          <CompareRow label="Cross-border compliance" legacy="Correspondent bank discretion" stable="Protocol-enforced, jurisdiction-aware" />
          <CompareRow label="API integration" legacy="ISO 20022 / MT103 messages" stable="npm install, 3 lines of SDK" />
        </div>
      </section>

      {/* ── Use cases ── */}
      <section style={{ padding: '0 48px 80px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center' as const, marginBottom: 40 }}>
          <Tag color={C.accent} bg={C.accentDim}>Use Cases</Tag>
          <h2 style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', margin: '16px 0 0' }}>
            Institutional applications
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
          {[
            {
              title: 'Cross-Border Payroll (US → IN)',
              tag: 'Section 195 / FATCA',
              tagColor: C.purple,
              tagBg: C.purpleDim,
              desc: 'US multinationals with India-based engineering teams can pay salaries in instUSD with automatic 5% sender-side TDS and 10% receiver-side deduction, fully compliant with Section 195 of the Income Tax Act and FATCA Form 1042-S reporting requirements.',
              example: 'Ctx:Salary|Out:125|In:250 · routed to CBDT ATA',
            },
            {
              title: 'Vendor & Contractor Payments',
              tag: 'FBAR / Form 8938',
              tagColor: C.accent,
              tagBg: C.accentDim,
              desc: 'B2B payments to overseas vendors are tagged with category context (Vendor, SaaS, Consulting) and emit a verifiable on-chain receipt. Finance teams can generate FBAR-compliant foreign account disclosures directly from chain data.',
              example: 'Ctx:Vendor|Out:0|In:0 · zero-tax compliant',
            },
            {
              title: 'DAOs & Protocol Treasuries',
              tag: 'Treasury Management',
              tagColor: C.green,
              tagBg: C.greenDim,
              desc: 'DeFi protocols and DAOs disbursing grants or contributor rewards across jurisdictions can use StableCompliance to ensure every outflow meets tax treaty obligations and is documented with an immutable on-chain event, reducing legal exposure.',
              example: 'Programmable treasury governance',
            },
            {
              title: 'Remittance & Consumer Finance',
              tag: 'VASP / FATF Travel Rule',
              tagColor: C.amber,
              tagBg: C.amberDim,
              desc: 'Fintech companies serving the $800B annual remittance market can embed StableCompliance into their transfer infrastructure to satisfy FATF Travel Rule obligations, VASP registration requirements, and FinCEN money transmission licensing at the protocol layer.',
              example: 'Built-in KYC context tagging',
            },
          ].map(u => (
            <div key={u.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: '22px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' as const }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: C.txt }}>{u.title}</span>
                <Tag color={u.tagColor} bg={u.tagBg}>{u.tag}</Tag>
              </div>
              <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.65, margin: '0 0 12px' }}>{u.desc}</p>
              <div style={{ fontFamily: C.mono, fontSize: 11, color: C.accent, background: C.surf, padding: '6px 10px', borderRadius: 5, border: `1px solid ${C.border}` }}>
                {u.example}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        padding: '80px 48px', textAlign: 'center' as const,
        background: C.surf, borderTop: `1px solid ${C.border}`,
      }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em', margin: '0 0 16px' }}>
            The future of compliant institutional finance is on-chain
          </h2>
          <p style={{ fontSize: 15, color: C.sub, lineHeight: 1.65, marginBottom: 36 }}>
            StableCompliance is the first protocol to make cross-border tax compliance programmable, atomic, and audit-ready — without banks, without manual reconciliation, without waiting 5 business days.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' as const }}>
            <a href="#" style={{ fontSize: 14, fontWeight: 700, color: '#fff', textDecoration: 'none', padding: '13px 32px', background: C.accent, borderRadius: 8 }}>Launch App</a>
            <a href="#" style={{ fontSize: 14, fontWeight: 600, color: C.txt, textDecoration: 'none', padding: '13px 32px', border: `1px solid ${C.borderHi}`, borderRadius: 8 }}>Read the Docs</a>
            <a href="https://github.com" target="_blank" rel="noreferrer" style={{ fontSize: 14, fontWeight: 600, color: C.sub, textDecoration: 'none', padding: '13px 32px', border: `1px solid ${C.border}`, borderRadius: 8 }}>GitHub ↗</a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ padding: '24px 48px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, background: C.accent, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff' }}>S</div>
          <span style={{ fontSize: 12, color: C.sub }}>StableCompliance Protocol · Solana Devnet</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['FATCA', 'FBAR', 'TDS Section 195', 'OFAC SDN', 'FATF Travel Rule'].map(t => (
            <span key={t} style={{ fontSize: 10, color: C.sub, fontFamily: C.mono }}>{t}</span>
          ))}
        </div>
        <span style={{ fontSize: 11, color: C.sub, fontFamily: C.mono }}>Program: DMSJPGe...aiSX</span>
      </footer>
    </div>
  );
}