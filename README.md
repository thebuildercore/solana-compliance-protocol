

# 🌐 StableCompliance Protocol


**Institutional-grade cross-border payment routing and programmable tax compliance on the Solana blockchain.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solana](https://img.shields.io/badge/Solana-Devnet-green?logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)

StableCompliance is an end-to-end suite that embeds regulatory logic directly into the transaction layer. By utilizing off-chain OFAC screening middleware, on-chain atomic tax splits (via Anchor CPI), and immutable audit events, institutions can move stablecoins globally with zero compliance friction.

---

## 🚀 Live Demo (Judge Walkthrough)

We built a seamless testing environment. You do not need to mint your own tokens or use the CLI to test this protocol.

**Step 1: Get Funded**
1. Navigate to the **[CFO Audit Dashboard](https://[YOUR_DASHBOARD_URL])**.
2. Locate the **Judge Test Faucet** widget.
3. Paste your Solana Devnet address and click "Airdrop" to receive 1,000 `instUSD`.

**Step 2: Execute a Compliant Transfer**
1. Open the **[ Wallet](https://solana-compliance-protocol-mock-wal.vercel.app/) and get test tokens for the faucet - bottom of the landing page. (https://solana-compliance-protocol-cfo-dash.vercel.app/)** and connect your funded Devnet Phantom wallet.
2. Select a transfer category (e.g., *Salary* or *Vendor*).
3. Enter an amount(eg., 100) and click Send. The SDK will automatically intercept the transaction to calculate the jurisdiction-specific tax splits (e.g., 5% US, 10% IN).
4. Approve the transaction in your wallet.

**Step 3: Verify the Audit Trail**
1. Switch back to the **[CFO Audit Dashboard](https://solana-compliance-protocol-cfo-dash.vercel.app/)**.
2. Watch your transaction appear instantly in the institutional ledger. 
3. The dashboard decodes the on-chain `CompliantTransferEvent` to cryptographically prove the funds were accurately split to the US and IN treasuries, automatically converting the USDC values to local fiat equivalents (USD/INR).

---

## 🏗️ Protocol Architecture

StableCompliance operates across three distinct layers to ensure security, speed, and regulatory adherence:

### 1. The Middleware SDK (`@stable-compliance/protocol-sdk`)
* **Pre-chain OFAC Screening:** Rejects transactions to sanctioned addresses before they consume network gas.
* **Context Tagging:** Attaches localized tax rules based on transaction categories.
* **Transaction Construction:** Builds the complex multi-instruction payload required for the Anchor program to execute the split.

### 2. The Anchor Smart Contract (`programs/compliance-router`)
* **Atomic CPI Splits:** Executes a 3-way split in a single transaction (Sender → Receiver, Sender → US Treasury, Sender → IN Treasury). If any leg fails, the entire transaction reverts.
* **Token Validation:** Ensures only authorized mints (`instUSD`) are routed.
* **Event Emission:** Fires a `CompliantTransferEvent` into the Solana logs, creating a permanent, verifiable receipt containing region and tax data.

### 3. The Audit Indexer (CFO Dashboard)
* Listens to Solana Devnet RPC nodes for program events.
* Decodes Base64 on-chain data into human-readable accounting ledgers.
* Facilitates real-time Forex conversion for institutional reporting (FATCA, Section 195 TDS, FBAR).

---

## 📜 Devnet Contract Addresses

For auditors wishing to verify the on-chain data manually via the [Solana Explorer](https://explorer.solana.com/?cluster=devnet):

| Component | Address |
| :--- | :--- |
| **Program ID** | `DMSJPGeWdenYtxCxqpEH2Jm9gJTSuacujo9doRDgaiSX` |
| **instUSD Mint** | `2fJkJa8tZiPf39DmjJyK4zopi28c8r2VajWke3PnQsDW` |
| **US Treasury (ATA)** | `jm3oZdADTa59vKUPqaJBYYebVXbN1WRsmkiW4tHzGgG` |
| **IN Treasury (ATA)** | `BE8mgjbxxmvNytadX3C9uCZRFeNE5xvkQwvmCB9chJ9U` |

---

## 💻 Local Development

This project is structured as a Turborepo/Bun monorepo. To run it locally:

```bash
# 1. Clone the repository
git clone [https://github.com/thebuildercore/solana-compliance-protocol.git](https://github.com/thebuildercore/solana-compliance-protocol.git)
cd solana-compliance-protocol

# 2. Install dependencies via Bun
bun install

# 3. Build the Protocol SDK
cd packages/protocol-sdk
bunx tsc
cd ../..

# 4. Run the CFO Dashboard (Port 3000)
cd apps/cfo-dashboard
bun run dev

# 5. Run the Mock Wallet in a new terminal (Port 3001)
cd apps/mock-wallet
bun run dev
