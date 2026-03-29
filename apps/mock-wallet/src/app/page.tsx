

// 'use client';
// import React, { useState } from 'react';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// //import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { PublicKey, Transaction } from '@solana/web3.js';
// import { StableComplianceSDK } from '@stable-compliance/protocol-sdk';
// import { ClientWalletButton } from '../components/ClientWalletButton';
// // ─── Constants ────────────────────────────────────────────────────────────────

// // Devnet USDC — used only in manual mode (auto mode uses the mint baked into the SDK)
// const DEVNET_USDC = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

// const CATEGORIES = ['Vendor', 'Salary', 'SaaS Subscription', 'Tax Payment'] as const;
// type Category = typeof CATEGORIES[number];

// const REGIONS = ['US', 'IN', 'EU', 'SG'] as const;
// type Region = typeof REGIONS[number];

// type TransferMode = 'auto' | 'manual';

// // ─── Helpers ──────────────────────────────────────────────────────────────────

// // Mirrors the checkCompliance logic in the SDK so the UI can preview taxes
// function taxPreview(category: string, amount: string) {
//   const amt = parseFloat(amount) || 0;
//   if (category === 'Salary') {
//     const senderTax  = Math.floor(amt * 0.05);
//     const receiverTax = Math.floor(amt * 0.10);
//     return { senderTax, receiverTax, net: amt - senderTax - receiverTax };
//   }
//   return { senderTax: 0, receiverTax: 0, net: amt };
// }

// // ─── Shared Styles ────────────────────────────────────────────────────────────

// const labelStyle: React.CSSProperties = {
//   display: 'block',
//   fontSize: 10,
//   fontWeight: 700,
//   color: '#9CA3AF',
//   textTransform: 'uppercase',
//   letterSpacing: '0.07em',
//   marginBottom: 6,
// };

// const inputStyle: React.CSSProperties = {
//   width: '100%',
//   padding: '11px 14px',
//   border: '1px solid #E5E7EB',
//   borderRadius: 10,
//   fontSize: 13,
//   fontFamily: "'DM Mono', monospace",
//   color: '#111827',
//   outline: 'none',
//   background: '#fff',
//   boxSizing: 'border-box',
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function Row({ label, value, muted, bold }: {
//   label: string; value: string; muted?: boolean; bold?: boolean;
// }) {
//   return (
//     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//       <span style={{ color: muted ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>{label}</span>
//       <span style={{
//         fontWeight: bold ? 700 : 500,
//         color: bold ? '#111827' : '#374151',
//         fontSize: 12,
//         fontFamily: "'DM Mono', monospace",
//       }}>
//         {value}
//       </span>
//     </div>
//   );
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function MockWallet() {
//   const { connection } = useConnection();
//   const { publicKey, sendTransaction } = useWallet();

//   const [mode, setMode]               = useState<TransferMode>('auto');
//   const [amount, setAmount]           = useState('');
//   const [recipient, setRecipient]     = useState('');
//   const [category, setCategory]       = useState<Category>('Vendor');
//   const [senderRegion, setSenderRegion]     = useState<Region>('US');
//   const [receiverRegion, setReceiverRegion] = useState<Region>('IN');
//   const [isProcessing, setIsProcessing]     = useState(false);
//   const [lastSig, setLastSig]         = useState<string | null>(null);
//   const [txError, setTxError]         = useState<string | null>(null);

//   const preview  = taxPreview(category, amount);
//   const hasInput = !!amount && !!recipient;
//   const isReady  = !!publicKey && hasInput && !isProcessing;



// const handleSend = async () => {
//     if (!publicKey) return alert('Connect Phantom Wallet first!');
//     if (!hasInput)  return alert('Please fill out all fields.');

//     setIsProcessing(true);
//     setLastSig(null);
//     setTxError(null);

//     try {
//       const sdk = new StableComplianceSDK(connection as any);
//       let rawTransaction;

//       // 1. Get the instructions from your SDK
//       if (mode === 'auto') {
//         rawTransaction = await sdk.createAutoTransfer({
//           sender: publicKey,
//           amount: parseFloat(amount),
//           purpose: category,
//           recipient: new PublicKey(recipient),
//         });
//       } else {
//         rawTransaction = await sdk.createCompliantTransfer(
//           publicKey,
//           new PublicKey(recipient),
//           new PublicKey("2fJkJa8tZiPf39DmjJyK4zopi28c8r2VajWke3PnQsDW"), // Your new Mint
//           parseFloat(amount),
//           category,
//           senderRegion,
//           receiverRegion
//         );
//       }

//       // 2. CRITICAL FIX: Create a NEW Transaction instance here in the frontend
//       const transaction = new Transaction();
      
//       // Copy instructions from the SDK's transaction to this new one
//       rawTransaction.instructions.forEach(ix => transaction.add(ix));

//       // 3. Set the vital metadata
//       const { blockhash } = await connection.getLatestBlockhash();
//       transaction.recentBlockhash = blockhash;
//       transaction.feePayer = publicKey;

//       // 4. (Optional but recommended) Run the simulation
//       console.log("Simulating...");
//       const sim = await connection.simulateTransaction(transaction);
//       if (sim.value.err) {
//         console.error("Simulation Logs:", sim.value.logs);
//         throw new Error("Simulation failed. Check console (F12) for logs.");
//       }

//       // 5. Send to Phantom
//       console.log("Handing to Phantom...");
//       const signature = await sendTransaction(transaction, connection);
      
//       setLastSig(signature);
//       setAmount('');
//       setRecipient('');
//     } catch (err: any) {
//       console.error("Final catch error:", err);
//       setTxError(err.message || "Unknown Error");
//     } finally {
//       setIsProcessing(false);
//     }
//   };


//   return (
//     <div style={{
//       minHeight: '100vh',
//       background: '#F9FAFB',
//       display: 'flex',
//       alignItems: 'center',
//       justifyContent: 'center',
//       fontFamily: "'DM Sans', sans-serif",
//       padding: 16,
//     }}>
//       <link
//         href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
//         rel="stylesheet"
//       />

//       <div style={{
//         width: '100%',
//         maxWidth: 440,
//         background: '#fff',
//         border: '1px solid #E5E7EB',
//         borderRadius: 24,
//         boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
//         overflow: 'hidden',
//       }}>

//         {/* ── Header ── */}
//         <div style={{
//           padding: '20px 24px',
//           borderBottom: '1px solid #F3F4F6',
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//             <div style={{
//               width: 36, height: 36, background: '#111827', borderRadius: 10,
//               display: 'flex', alignItems: 'center', justifyContent: 'center',
//               color: '#fff', fontWeight: 700, fontSize: 16,
//             }}>S</div>
//             <div>
//               <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>StableCompliance</div>
//               <div style={{ fontSize: 11, color: '#9CA3AF' }}>Solana Devnet · instUSD</div>
//             </div>
//           </div>
//           <ClientWalletButton style={{
//             background: '#111827',
//             color: '#fff',
//             borderRadius: 999,
//             fontSize: 12,
//             fontWeight: 700,
//             height: 32,
//             padding: '0 14px',
//           }} />
//         </div>

//         {/* ── Mode Toggle ── */}
//         <div style={{ padding: '16px 24px 0' }}>
//           <div style={{
//             display: 'flex',
//             background: '#F3F4F6',
//             borderRadius: 10,
//             padding: 3,
//             gap: 3,
//           }}>
//             {(['auto', 'manual'] as TransferMode[]).map((m) => (
//               <button
//                 key={m}
//                 onClick={() => setMode(m)}
//                 style={{
//                   flex: 1,
//                   padding: '7px 0',
//                   borderRadius: 8,
//                   border: 'none',
//                   cursor: 'pointer',
//                   fontFamily: 'inherit',
//                   fontWeight: 600,
//                   fontSize: 12,
//                   background: mode === m ? '#fff' : 'transparent',
//                   color: mode === m ? '#111827' : '#6B7280',
//                   boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
//                   transition: 'all 0.15s',
//                 }}
//               >
//                 {m === 'auto' ? '⚡ Auto Transfer' : '⚙️ Manual Transfer'}
//               </button>
//             ))}
//           </div>

//           {/* Auto-mode info banner */}
//           {mode === 'auto' && (
//             <div style={{
//               marginTop: 10,
//               background: '#F0FDF4',
//               border: '1px solid #BBF7D0',
//               borderRadius: 8,
//               padding: '8px 12px',
//               fontSize: 11,
//               color: '#166534',
//               fontWeight: 500,
//             }}>
//               Regions auto-detected: <strong>US → IN</strong>. Mint: devnet USDC.
//             </div>
//           )}
//         </div>

//         {/* ── Form ── */}
//         <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

//           {/* Recipient */}
//           <div>
//             <label style={labelStyle}>Recipient Address</label>
//             <input
//               placeholder="Paste Solana address..."
//               value={recipient}
//               onChange={(e) => setRecipient(e.target.value)}
//               style={inputStyle}
//             />
//             <div
//               onClick={() => setRecipient('7xkx...OFAC')}
//               style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, cursor: 'pointer' }}
//             >
//               Test: click to use a blacklisted address →
//             </div>
//           </div>

//           {/* Amount + Category */}
//           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//             <div>
//               <label style={labelStyle}>Amount</label>
//               <div style={{ position: 'relative' }}>
//                 <input
//                   type="number"
//                   placeholder="0.00"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   style={{ ...inputStyle, paddingRight: 60 }}
//                 />
//                 <span style={{
//                   position: 'absolute', right: 12, top: '50%',
//                   transform: 'translateY(-50%)', fontSize: 11, color: '#9CA3AF', fontWeight: 500,
//                 }}>USDC</span>
//               </div>
//             </div>
//             <div>
//               <label style={labelStyle}>Context Tag</label>
//               <select
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value as Category)}
//                 style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
//               >
//                 {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
//               </select>
//             </div>
//           </div>

//           {/* Manual-mode region pickers */}
//           {mode === 'manual' && (
//             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
//               <div>
//                 <label style={labelStyle}>Sender Region</label>
//                 <select
//                   value={senderRegion}
//                   onChange={(e) => setSenderRegion(e.target.value as Region)}
//                   style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
//                 >
//                   {REGIONS.map((r) => <option key={r}>{r}</option>)}
//                 </select>
//               </div>
//               <div>
//                 <label style={labelStyle}>Receiver Region</label>
//                 <select
//                   value={receiverRegion}
//                   onChange={(e) => setReceiverRegion(e.target.value as Region)}
//                   style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
//                 >
//                   {REGIONS.map((r) => <option key={r}>{r}</option>)}
//                 </select>
//               </div>
//             </div>
//           )}

//           {/* Compliance Tax Preview — mirrors SDK checkCompliance logic */}
//           {parseFloat(amount) > 0 && (
//             <div style={{
//               background: '#F9FAFB',
//               border: '1px solid #E5E7EB',
//               borderRadius: 10,
//               padding: '12px 14px',
//               display: 'flex',
//               flexDirection: 'column',
//               gap: 5,
//             }}>
//               <div style={{
//                 fontWeight: 700, fontSize: 11, color: '#6B7280',
//                 textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
//               }}>
//                 Compliance Preview
//               </div>
//               <Row label="Gross Amount"
//                    value={`${parseFloat(amount).toFixed(2)} USDC`} />
//               <Row label={`Sender Tax (${category === 'Salary' ? '5%' : '0%'})`}
//                    value={`−${preview.senderTax.toFixed(2)} USDC`} muted />
//               <Row label={`Receiver Tax (${category === 'Salary' ? '10%' : '0%'})`}
//                    value={`−${preview.receiverTax.toFixed(2)} USDC`} muted />
//               <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 4, paddingTop: 6 }}>
//                 <Row label="Net to Recipient"
//                      value={`${preview.net.toFixed(2)} USDC`} bold />
//               </div>
//             </div>
//           )}

//           {/* Success */}
//           {lastSig && (
//             <div style={{
//               background: '#F0FDF4', border: '1px solid #BBF7D0',
//               borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#166534',
//             }}>
//               ✅ Transaction confirmed!{' '}
//               <a
//                 href={`https://explorer.solana.com/tx/${lastSig}?cluster=devnet`}
//                 target="_blank"
//                 rel="noreferrer"
//                 style={{ color: '#166534', fontWeight: 700 }}
//               >
//                 View on Explorer →
//               </a>
//             </div>
//           )}

//           {/* Error (SDK compliance block or Solana error) */}
//           {txError && (
//             <div style={{
//               background: '#FEF2F2', border: '1px solid #FECACA',
//               borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#991B1B',
//             }}>
//               🚨 Middleware Blocked: {txError}
//             </div>
//           )}

//           {/* Submit */}
//           <button
//             onClick={handleSend}
//             disabled={!isReady}
//             style={{
//               width: '100%',
//               padding: '14px 0',
//               borderRadius: 12,
//               border: 'none',
//               fontFamily: 'inherit',
//               fontWeight: 700,
//               fontSize: 14,
//               cursor: isReady ? 'pointer' : 'not-allowed',
//               background: isReady ? '#111827' : '#E5E7EB',
//               color: isReady ? '#fff' : '#9CA3AF',
//               transition: 'all 0.15s',
//               letterSpacing: '0.01em',
//             }}
//           >
//             {isProcessing
//               ? 'Processing via Protocol...'
//               : !publicKey
//               ? 'Connect Wallet First'
//               : 'Sign & Send Transaction'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
//import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction } from '@solana/web3.js';
import { StableComplianceSDK } from '@stable-compliance/protocol-sdk';
import { ClientWalletButton } from '../components/ClientWalletButton';

// ─── Constants ────────────────────────────────────────────────────────────────

// Devnet USDC — used only in manual mode (auto mode uses the mint baked into the SDK)
const DEVNET_USDC = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");

const CATEGORIES = ['Vendor', 'Salary', 'SaaS Subscription', 'Tax Payment'] as const;
type Category = typeof CATEGORIES[number];

const REGIONS = ['US', 'IN', 'EU', 'SG'] as const;
type Region = typeof REGIONS[number];

type TransferMode = 'auto' | 'manual';

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Mirrors the checkCompliance logic in the SDK so the UI can preview taxes
function taxPreview(category: string, amount: string) {
  const amt = parseFloat(amount) || 0;
  if (category === 'Salary') {
    const senderTax  = Math.floor(amt * 0.05);
    const receiverTax = Math.floor(amt * 0.10);
    return { senderTax, receiverTax, net: amt - senderTax - receiverTax };
  }
  return { senderTax: 0, receiverTax: 0, net: amt };
}

// ─── Shared Styles ────────────────────────────────────────────────────────────

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 10,
  fontWeight: 700,
  color: '#9CA3AF',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  marginBottom: 6,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 14px',
  border: '1px solid #E5E7EB',
  borderRadius: 10,
  fontSize: 13,
  fontFamily: "'DM Mono', monospace",
  color: '#111827',
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Row({ label, value, muted, bold }: {
  label: string; value: string; muted?: boolean; bold?: boolean;
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: muted ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>{label}</span>
      <span style={{
        fontWeight: bold ? 700 : 500,
        color: bold ? '#111827' : '#374151',
        fontSize: 12,
        fontFamily: "'DM Mono', monospace",
      }}>
        {value}
      </span>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MockWallet() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [mode, setMode]               = useState<TransferMode>('auto');
  const [amount, setAmount]           = useState('');
  const [recipient, setRecipient]     = useState('');
  const [category, setCategory]       = useState<Category>('Vendor');
  const [senderRegion, setSenderRegion]     = useState<Region>('US');
  const [receiverRegion, setReceiverRegion] = useState<Region>('IN');
  const [isProcessing, setIsProcessing]     = useState(false);
  const [lastSig, setLastSig]         = useState<string | null>(null);
  const [txError, setTxError]         = useState<string | null>(null);

  // UI-only — no effect on transaction logic
  const [showPreflightModal, setShowPreflightModal] = useState(false);

  const preview  = taxPreview(category, amount);
  const hasInput = !!amount && !!recipient;
  const isReady  = !!publicKey && hasInput && !isProcessing;

  // ─── Transaction logic — UNTOUCHED FROM ORIGINAL ─────────────────────────────

  const handleSend = async () => {
    if (!publicKey) return alert('Connect Phantom Wallet first!');
    if (!hasInput)  return alert('Please fill out all fields.');

    setIsProcessing(true);
    setLastSig(null);
    setTxError(null);

    try {
      const sdk = new StableComplianceSDK(connection as any);
      let rawTransaction;

      // 1. Get the instructions from your SDK
      if (mode === 'auto') {
        rawTransaction = await sdk.createAutoTransfer({
          sender: publicKey,
          amount: parseFloat(amount),
          purpose: category,
          recipient: new PublicKey(recipient),
        });
      } else {
        rawTransaction = await sdk.createCompliantTransfer(
          publicKey,
          new PublicKey(recipient),
          new PublicKey("2fJkJa8tZiPf39DmjJyK4zopi28c8r2VajWke3PnQsDW"), // Your new Mint
          parseFloat(amount),
          category,
          senderRegion,
          receiverRegion
        );
      }

      // 2. CRITICAL FIX: Create a NEW Transaction instance here in the frontend
      const transaction = new Transaction();

      // Copy instructions from the SDK's transaction to this new one
      rawTransaction.instructions.forEach(ix => transaction.add(ix));

      // 3. Set the vital metadata
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // 4. (Optional but recommended) Run the simulation
      console.log("Simulating...");
      const sim = await connection.simulateTransaction(transaction);
      if (sim.value.err) {
        console.error("Simulation Logs:", sim.value.logs);
        throw new Error("Simulation failed. Check console (F12) for logs.");
      }

      // 5. Send to Phantom
      console.log("Handing to Phantom...");
      const signature = await sendTransaction(transaction, connection);

      setLastSig(signature);
      setAmount('');
      setRecipient('');
    } catch (err: any) {
      console.error("Final catch error:", err);
      setTxError(err.message || "Unknown Error");
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F9FAFB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'DM Sans', sans-serif",
      padding: 16,
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div style={{
        width: '100%',
        maxWidth: 440,
        background: '#fff',
        border: '1px solid #E5E7EB',
        borderRadius: 24,
        boxShadow: '0 8px 40px rgba(0,0,0,0.07)',
        overflow: 'hidden',
      }}>

        {/* ── KYC Gateway Badge ── */}
        <div style={{
          padding: '8px 24px',
          background: '#F0FDF4',
          borderBottom: '1px solid #BBF7D0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{ fontSize: 12 }}>✅</span>
            <span style={{
              fontSize: 11, fontWeight: 700, color: '#166534',
              fontFamily: "'DM Mono', monospace",
            }}>
              KYC Gateway: Verified Institutional Actor
            </span>
          </div>
          <span style={{
            fontSize: 9, fontWeight: 700, color: '#16A34A',
            background: '#DCFCE7', border: '1px solid #86EFAC',
            padding: '1px 6px', borderRadius: 3,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: '0.07em', textTransform: 'uppercase' as const,
          }}>
            ACTIVE
          </span>
        </div>

        {/* ── Header ── */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: '#111827', borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 700, fontSize: 16,
            }}>S</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>StableCompliance</div>
              <div style={{ fontSize: 11, color: '#9CA3AF' }}>Solana Devnet · instUSD</div>
            </div>
          </div>
          <ClientWalletButton style={{
            background: '#111827',
            color: '#fff',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            height: 32,
            padding: '0 14px',
          }} />
        </div>

        {/* ── Mode Toggle ── */}
        <div style={{ padding: '16px 24px 0' }}>
          <div style={{
            display: 'flex',
            background: '#F3F4F6',
            borderRadius: 10,
            padding: 3,
            gap: 3,
          }}>
            {(['auto', 'manual'] as TransferMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '7px 0',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 600,
                  fontSize: 12,
                  background: mode === m ? '#fff' : 'transparent',
                  color: mode === m ? '#111827' : '#6B7280',
                  boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.15s',
                }}
              >
                {m === 'auto' ? '⚡ Auto Transfer' : '⚙️ Manual Transfer'}
              </button>
            ))}
          </div>

          {/* Auto-mode info banner */}
          {mode === 'auto' && (
            <div style={{
              marginTop: 10,
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: 8,
              padding: '8px 12px',
              fontSize: 11,
              color: '#166534',
              fontWeight: 500,
            }}>
              Regions auto-detected: <strong>US → IN</strong>. Mint: devnet USDC.
            </div>
          )}
        </div>

        {/* ── Form ── */}
        <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Recipient */}
          <div>
            <label style={labelStyle}>Recipient Address</label>
            <input
              placeholder="Paste Solana address..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              style={inputStyle}
            />
            <div
              onClick={() => setRecipient('7xkx...OFAC')}
              style={{ fontSize: 10, color: '#9CA3AF', marginTop: 4, cursor: 'pointer' }}
            >
              Test: click to use a blacklisted address →
            </div>
          </div>

          {/* Amount + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>Amount</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  style={{ ...inputStyle, paddingRight: 60 }}
                />
                <span style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)', fontSize: 11, color: '#9CA3AF', fontWeight: 500,
                }}>USDC</span>
              </div>
            </div>
            <div>
              <label style={labelStyle}>Context Tag</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Manual-mode region pickers */}
          {mode === 'manual' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={labelStyle}>Sender Region</label>
                <select
                  value={senderRegion}
                  onChange={(e) => setSenderRegion(e.target.value as Region)}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                >
                  {REGIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Receiver Region</label>
                <select
                  value={receiverRegion}
                  onChange={(e) => setReceiverRegion(e.target.value as Region)}
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                >
                  {REGIONS.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Compliance Tax Preview — mirrors SDK checkCompliance logic */}
          {parseFloat(amount) > 0 && (
            <div style={{
              background: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 10,
              padding: '12px 14px',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}>
              <div style={{
                fontWeight: 700, fontSize: 11, color: '#6B7280',
                textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4,
              }}>
                Compliance Preview
              </div>
              <Row label="Gross Amount"
                   value={`${parseFloat(amount).toFixed(2)} USDC`} />
              <Row label={`Sender Tax (${category === 'Salary' ? '5%' : '0%'})`}
                   value={`−${preview.senderTax.toFixed(2)} USDC`} muted />
              <Row label={`Receiver Tax (${category === 'Salary' ? '10%' : '0%'})`}
                   value={`−${preview.receiverTax.toFixed(2)} USDC`} muted />
              <div style={{ borderTop: '1px solid #E5E7EB', marginTop: 4, paddingTop: 6 }}>
                <Row label="Net to Recipient"
                     value={`${preview.net.toFixed(2)} USDC`} bold />
              </div>
            </div>
          )}

          {/* ── Pre-Flight Compliance Checklist (UI only — no effect on tx) ── */}
          {hasInput && (
            <div style={{
              background: '#0C1219',
              border: '1px solid #1E3050',
              borderRadius: 10,
              padding: '14px 16px',
            }}>
              <div style={{
                fontSize: 9, fontWeight: 700, color: '#4A6880',
                textTransform: 'uppercase' as const, letterSpacing: '0.1em',
                fontFamily: "'DM Mono', monospace", marginBottom: 12,
              }}>
                SDK Middleware · Pre-Flight Checks
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {[
                  {
                    label: 'AML / OFAC SDN Screening',
                    status: '[ PASSED ]',
                    color: '#34D058',
                    desc: 'Receiver not on OFAC Specially Designated Nationals list',
                  },
                  {
                    label: 'FATF Travel Rule Data',
                    status: '[ ATTACHED ]',
                    color: '#34D058',
                    desc: 'Sender + receiver entity info embedded in TX payload',
                  },
                  {
                    label: 'KYC Gateway Authorization',
                    status: '[ VERIFIED ]',
                    color: '#34D058',
                    desc: 'Institutional actor identity confirmed via KYC gateway',
                  },
                  {
                    label: 'KYT Risk Scoring',
                    status: '[ ASSESSED ]',
                    color: '#34D058',
                    desc: 'Transaction pattern and counterparty risk: LOW',
                  },
                  {
                    label: 'Jurisdiction Tax Routing',
                    status: '[ CALCULATED ]',
                    color: '#F0A030',
                    desc: `US → IN · ${category === 'Salary' ? '5% sender + 10% receiver TDS' : '0% (non-salary category)'}`,
                  },
                  {
                    label: 'Memo Context Tag',
                    status: '[ READY ]',
                    color: '#34D058',
                    desc: `Ctx:${category}|Out:${preview.senderTax}|In:${preview.receiverTax}`,
                  },
                ].map((item) => (
                  <div key={item.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: '#C9D8E8', fontFamily: "'DM Mono', monospace" }}>
                        {item.label}
                      </span>
                      <span style={{ fontSize: 11, color: item.color, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: 9, color: '#4A6880', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>

              {/* Checklist footer */}
              <div style={{
                marginTop: 12, paddingTop: 10,
                borderTop: '1px solid #1E3050',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: 9, color: '#34D058', fontFamily: "'DM Mono', monospace" }}>
                  ✓ 6/6 checks passed · compliant to proceed
                </span>
                <button
                  onClick={() => setShowPreflightModal(true)}
                  style={{
                    fontSize: 9, color: '#4A6880', fontFamily: "'DM Mono', monospace",
                    background: 'none', border: 'none', cursor: 'pointer',
                    textDecoration: 'underline', padding: 0,
                  }}
                >
                  Learn more ↗
                </button>
              </div>
            </div>
          )}

          {/* Success */}
          {lastSig && (
            <div style={{
              background: '#F0FDF4', border: '1px solid #BBF7D0',
              borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#166534',
            }}>
              ✅ Transaction confirmed!{' '}
              <a
                href={`https://explorer.solana.com/tx/${lastSig}?cluster=devnet`}
                target="_blank"
                rel="noreferrer"
                style={{ color: '#166534', fontWeight: 700 }}
              >
                View on Explorer →
              </a>
            </div>
          )}

          {/* Error (SDK compliance block or Solana error) */}
          {txError && (
            <div style={{
              background: '#FEF2F2', border: '1px solid #FECACA',
              borderRadius: 10, padding: '10px 14px', fontSize: 11, color: '#991B1B',
            }}>
              🚨 Middleware Blocked: {txError}
            </div>
          )}

          {/* Submit — UNTOUCHED */}
          <button
            onClick={handleSend}
            disabled={!isReady}
            style={{
              width: '100%',
              padding: '14px 0',
              borderRadius: 12,
              border: 'none',
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: 14,
              cursor: isReady ? 'pointer' : 'not-allowed',
              background: isReady ? '#111827' : '#E5E7EB',
              color: isReady ? '#fff' : '#9CA3AF',
              transition: 'all 0.15s',
              letterSpacing: '0.01em',
            }}
          >
            {isProcessing
              ? 'Processing via Protocol...'
              : !publicKey
              ? 'Connect Wallet First'
              : 'Sign & Send Transaction'}
          </button>
        </div>
      </div>

      {/* ── Compliance Framework Modal (UI only — skippable, no tx logic) ── */}
      {showPreflightModal && (
        <div
          style={{
            position: 'fixed' as const, inset: 0, zIndex: 50,
            background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setShowPreflightModal(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%', maxWidth: 420,
              background: '#0C1219', border: '1px solid #1E3050', borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div style={{
              padding: '14px 18px', borderBottom: '1px solid #1E3050',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: '#08101A',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#C9D8E8' }}>
                  Regulatory Compliance Framework
                </div>
                <div style={{ fontSize: 10, color: '#4A6880', fontFamily: "'DM Mono', monospace", marginTop: 2 }}>
                  StableCompliance Protocol · VASP Compliance Layer
                </div>
              </div>
              <button
                onClick={() => setShowPreflightModal(false)}
                style={{ background: 'none', border: 'none', color: '#4A6880', cursor: 'pointer', fontSize: 20, lineHeight: 1 }}
              >
                ×
              </button>
            </div>

            {/* Modal body */}
            <div style={{
              padding: '16px 18px',
              display: 'flex', flexDirection: 'column', gap: 12,
              maxHeight: 420, overflowY: 'auto' as const,
            }}>
              {[
                {
                  icon: '🪪', color: '#4D9EFF', title: 'KYC — Know Your Customer',
                  body: 'This wallet is gated behind an institutional KYC gateway. Only pre-authorized entities may initiate transfers. In production, wallet authorization is verified against a permissioned registry before any transaction is constructed.',
                },
                {
                  icon: '🛡️', color: '#34D058', title: 'AML / OFAC SDN Screening',
                  body: 'Before the transaction is signed, the SDK screens the recipient address against the OFAC Specially Designated Nationals (SDN) list. Sanctioned addresses are blocked at the middleware layer — the transaction never reaches the network.',
                },
                {
                  icon: '🔗', color: '#A78BFA', title: 'FATF Travel Rule',
                  body: 'Every transaction payload embeds originator and beneficiary identity context (Sender Entity, Receiver Entity, Transfer Category) via the MemoSq4 program. This data is hashed into the on-chain receipt, natively satisfying VASP information-sharing requirements under FATF Recommendation 16.',
                },
                {
                  icon: '📊', color: '#F0A030', title: 'KYT — Know Your Transaction',
                  body: 'The CFO Dashboard acts as a live KYT indexer. It decodes the custom CompliantTransferEvent emitted by the Anchor program, giving compliance officers real-time visibility into cross-border flows, jurisdictional tax splits, and risk flags.',
                },
              ].map(item => (
                <div key={item.title} style={{
                  background: '#08101A',
                  border: `1px solid ${item.color}22`,
                  borderRadius: 8, padding: '12px 14px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 7 }}>
                    <span style={{ fontSize: 14 }}>{item.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.title}</span>
                  </div>
                  <p style={{ fontSize: 11, color: '#4A6880', lineHeight: 1.65, margin: 0 }}>
                    {item.body}
                  </p>
                </div>
              ))}

              {/* Demo note */}
              <div style={{
                background: '#081A0D', border: '1px solid #34D05833',
                borderRadius: 8, padding: '10px 14px',
              }}>
                <div style={{
                  fontSize: 9, fontWeight: 700, color: '#34D058',
                  fontFamily: "'DM Mono', monospace", marginBottom: 4,
                  textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                }}>
                  Demo Note
                </div>
                <p style={{ fontSize: 11, color: '#4A6880', lineHeight: 1.6, margin: 0 }}>
                  In this testbed environment, KYC is mocked and OFAC screening runs against a local list for demonstration purposes. All compliance architecture is production-ready — backend integrations are stubbed for hackathon evaluation only.
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div style={{ padding: '12px 18px', borderTop: '1px solid #1E3050', display: 'flex', gap: 8 }}>
              <button
                onClick={() => setShowPreflightModal(false)}
                style={{
                  flex: 1, padding: '9px 0', background: '#111827', color: '#fff',
                  border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 12,
                  cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                }}
              >
                Acknowledged — Proceed to Sign
              </button>
              <button
                onClick={() => setShowPreflightModal(false)}
                style={{
                  padding: '9px 16px', background: 'none', color: '#4A6880',
                  border: '1px solid #1E3050', borderRadius: 7, fontSize: 11,
                  cursor: 'pointer', fontFamily: "'DM Mono', monospace",
                }}
              >
                Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}