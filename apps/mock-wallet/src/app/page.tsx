// 'use client';
// import React, { useState } from 'react';
// import { useConnection, useWallet } from '@solana/wallet-adapter-react';
// import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// import { PublicKey } from '@solana/web3.js';
// import { StableComplianceSDK } from '@stable-compliance/protocol-sdk';

// export default function MockWallet() {
//   // Solana Hooks
//   const { connection } = useConnection();
//   const { publicKey, sendTransaction } = useWallet();

//   // UI State
//   const [amount, setAmount] = useState('');
//   const [recipient, setRecipient] = useState('');
//   const [category, setCategory] = useState('Vendor');
//   const [isProcessing, setIsProcessing] = useState(false);

//   // The actual execution logic
//   const handleSend = async () => {
//     if (!publicKey) return alert("Connect Phantom Wallet first!");
//     if (!recipient || !amount) return alert("Please fill out all fields.");

//     setIsProcessing(true);

//     try {
//       // 1. Initialize YOUR SDK
//       const sdk = new StableComplianceSDK(connection as any);

//       // 2. The SDK runs the off-chain rules AND builds the Solana transaction
//       const transaction = await sdk.createCompliantTransfer(
//         publicKey, // Sender (You)
//         new PublicKey(recipient),
//         new PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"), // Mainnet USDC Mint (Mocking for UI)
//         parseFloat(amount),
//         category,
//         "India"
//       );

//       // 3. Phantom prompts the user to sign the legally-tagged transaction
//       const signature = await sendTransaction(transaction, connection);
      
//       alert(`✅ Success! Transaction logged on Solana.\nSignature: ${signature}`);
//       setAmount('');
//       setRecipient('');
      
//     } catch (error: any) {
//       // If the SDK's off-chain rules (like OFAC check) fail, it throws an error here before hitting Solana
//       alert(`🚨 Middleware Blocked Transfer:\n${error.message}`);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 text-[#111827] flex items-center justify-center font-sans p-4">
//       <div className="w-full max-w-md p-8 bg-white border border-gray-200 shadow-xl rounded-3xl transition-all">
        
//         {/* Header & Wallet Connect */}
//         <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
//           <div className="flex items-center gap-3">
//             <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white font-bold text-xl">W</div>
//             <div>
//                 <h2 className="text-md font-bold leading-tight">WickGuard Connect</h2>
//                 <p className="text-xs text-gray-500">Compliance Middleware</p>
//             </div>
//           </div>
//           {/* The REAL Phantom connect button */}
//           <WalletMultiButton className="!bg-[#111827] hover:!bg-gray-800 !h-8 !px-3 !py-0 !text-xs !font-bold !rounded-full transition" />
//         </div>

//         <div className="space-y-6">
//           {/* Recipient Input */}
//           <div>
//             <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Recipient Address</label>
//             <input 
//               placeholder="Paste Solana Address..."
//               value={recipient}
//               onChange={(e) => setRecipient(e.target.value)}
//               className="w-full p-4 bg-white border border-gray-200 focus:border-black rounded-xl text-sm font-mono outline-none transition"
//             />
//             <p className="text-[10px] text-gray-400 mt-1 cursor-pointer hover:text-black" onClick={() => setRecipient('7xkx...OFAC')}>
//               Tip: Click here to test a blacklisted address.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Amount</label>
//               <div className="relative">
//                 <input 
//                   type="number"
//                   placeholder="0.00"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   className="w-full p-4 border border-gray-200 rounded-xl text-lg font-semibold outline-none focus:border-black transition pr-16"
//                 />
//                 <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-400">instUSD</span>
//               </div>
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Context Tag</label>
//               <select 
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="w-full p-4 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:border-black appearance-none bg-white cursor-pointer"
//               >
//                 <option>Vendor</option>
//                 <option>Salary</option>
//                 <option>SaaS Subscription</option>
//                 <option>Tax Payment</option>
//               </select>
//             </div>
//           </div>

//           {/* Dynamic Submit Button */}
//           <button 
//             onClick={handleSend}
//             disabled={!publicKey || !amount || !recipient || isProcessing}
//             className={`w-full py-4 rounded-xl font-bold text-md transition-all active:scale-[0.98] flex justify-center items-center ${
//               !publicKey ? 'bg-gray-200 text-gray-400 cursor-not-allowed' :
//               (!amount || !recipient) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
//               'bg-black text-white hover:bg-gray-800 shadow-lg'
//             }`}
//           >
//             {isProcessing ? "Processing via Protocol..." : !publicKey ? "Connect Wallet First" : "Sign & Send Transaction"}
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

  const preview  = taxPreview(category, amount);
  const hasInput = !!amount && !!recipient;
  const isReady  = !!publicKey && hasInput && !isProcessing;

  // const handleSend = async () => {
  //   if (!publicKey) return alert('Connect Phantom Wallet first!');
  //   if (!hasInput)  return alert('Please fill out all fields.');

  //   setIsProcessing(true);
  //   setLastSig(null);
  //   setTxError(null);

  //   try {
  //     const sdk = new StableComplianceSDK(connection as any);
  //     let transaction: Transaction;

  //     if (mode === 'auto') {
  //       // createAutoTransfer: regions auto-set to US→IN inside the SDK,
  //       // devnet USDC mint is already baked in, sender is pulled from provider.wallet
  //       transaction = await sdk.createAutoTransfer({
  //         amount:    parseFloat(amount),
  //         purpose:   category,
  //         recipient: new PublicKey(recipient),
  //       });
  //     } else {
  //       // createCompliantTransfer: all params explicit
  //       transaction = await sdk.createCompliantTransfer(
  //         publicKey,
  //         new PublicKey(recipient),
  //         DEVNET_USDC,
  //         parseFloat(amount),
  //         category,
  //         senderRegion,
  //         receiverRegion
  //       );
  //     }
  //     // --- 🚨 NEW: THE SIMULATION DEBUGGER 🚨 ---
  //     // 1. Give the transaction the latest blockhash so the RPC accepts it
  //     const { blockhash } = await connection.getLatestBlockhash();
  //     transaction.recentBlockhash = blockhash;
  //     transaction.feePayer = publicKey;

  //     // 2. Simulate it directly against the blockchain
  //     console.log("Simulating transaction...");
  //     const simResult = await connection.simulateTransaction(transaction);
      
  //     if (simResult.value.err) {
  //       console.error("🚨 BLOCKCHAIN SIMULATION FAILED! Exact Logs:", simResult.value.logs);
  //       alert("Transaction failed simulation! Press F12 and look at the Console logs to see the exact Solana error.");
  //       setIsProcessing(false);
  //       return;
  //     }
      // ------------------------------------------

      // If simulation passes, hand it to Phantom

// console.log("Transaction being sent to Phantom:", transaction);
//       const signature = await sendTransaction(transaction, connection);
//       setLastSig(signature);
//       setAmount('');
//       setRecipient('');
//     } catch (err: any) {
//       // SDK throws before hitting Solana if compliance check fails (OFAC, etc.)
//       setTxError(err.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

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

          {/* Submit */}
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
    </div>
  );
}