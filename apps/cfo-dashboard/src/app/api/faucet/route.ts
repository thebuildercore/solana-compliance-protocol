// apps/cfo-dashboard/src/app/api/faucet/route.ts
import { NextResponse } from 'next/server';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import bs58 from 'bs58'; // You may need to run: npm install bs58

const USDC_MINT = new PublicKey("2fJkJa8tZiPf39DmjJyK4zopi28c8r2VajWke3PnQsDW");

export async function POST(request: Request) {
  try {
    const { address } = await request.json();
    if (!address) return NextResponse.json({ error: 'Address required' }, { status: 400 });

    const receiverPubkey = new PublicKey(address);
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

    // 1. Load your Faucet's Private Key from the secure .env file
    const privateKeyString = process.env.FAUCET_PRIVATE_KEY;
    if (!privateKeyString) throw new Error("Faucet is empty!");
    
    const faucetKeypair = Keypair.fromSecretKey(bs58.decode(privateKeyString));

    // 2. Get or create the ATA for the receiver (This prevents the 3012 Error!)
    const receiverAta = await getOrCreateAssociatedTokenAccount(
      connection,
      faucetKeypair, // Faucet pays the rent fee for the judge!
      USDC_MINT,
      receiverPubkey
    );

    // Get Faucet's ATA
    const faucetAta = await getOrCreateAssociatedTokenAccount(
      connection,
      faucetKeypair,
      USDC_MINT,
      faucetKeypair.publicKey
    );

    // 3. Send 1,000 tokens (adjust decimals if needed. Assuming 9 decimals)
    const amount = 1000 * Math.pow(10, 9); 
    
    const signature = await transfer(
      connection,
      faucetKeypair,
      faucetAta.address,
      receiverAta.address,
      faucetKeypair.publicKey,
      amount
    );

    return NextResponse.json({ success: true, signature });
  } catch (error: any) {
    console.error("Faucet Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}