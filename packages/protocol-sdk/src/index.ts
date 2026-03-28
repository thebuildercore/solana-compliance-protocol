// import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
// import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
// import { getAssociatedTokenAddress } from '@solana/spl-token';
// import BN from 'bn.js';
// import idl from './compliance_router.json';

// const PROGRAM_ID = new PublicKey("DMSJPGeWdenYtxCxqpEH2Jm9gJTSuacujo9doRDgaiSX");

// //const USDC_MINT = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU");
// // ✅ Update with your new Mint Address
// const USDC_MINT = new PublicKey("2fJkJa8tZiPf39DmjJyK4zopi28c8r2VajWke3PnQsDW");

// // Region → Treasury Mapping (IMPORTANT)
// const TREASURY_MAP: Record<string, PublicKey> = {
//     "US": new PublicKey("43MNuckFznmnCvzZcnKqmkHJH9PVcje4LSKwEWDj6Mkx"),
//     "IN": new PublicKey("h8kNyEcqG7MTg2MxntFQ5V2P3qSCWBzBhzzjEajVmqn"),
// };

// export class StableComplianceSDK {
//     private program: Program;
//     private provider: AnchorProvider;

//     constructor(connection: Connection) {
//         const dummyWallet = {
//             publicKey: PublicKey.default,
//             signTransaction: async (tx: any) => tx,
//             signAllTransactions: async (txs: any[]) => txs,
//         };

//         this.provider = new AnchorProvider(connection, dummyWallet as any, {});
        
//         this.program = new Program(
//             idl as unknown as Idl, 
//             this.provider
//         );
//     }

//     public checkCompliance(
//         amount: number,
//         category: string,
//         senderRegion: string,
//         receiverRegion: string,
//         recipient: string
//     ) {
//         const BLACKLIST = ["7xkx...OFAC", "Hacker...Wallet"];

//         if (BLACKLIST.includes(recipient)) {
//             return { isCompliant: false, senderTax: 0, receiverTax: 0, error: "OFAC violation" };
//         }

//         let senderTax = 0;
//         let receiverTax = 0;

//         if (category === "Salary") {
//             senderTax = Math.floor(amount * 0.05);
//             receiverTax = Math.floor(amount * 0.10);
//         }

//         return { isCompliant: true, senderTax, receiverTax, error: null };
//     }

//     public async createAutoTransfer(params: {
//         amount: number,
//         purpose: string,
//         recipient: PublicKey
//     }) {
//         // 1. Auto-lookup regions (Mocked for the Demo)
//         const senderRegion = "US";
//         const receiverRegion = "IN";

//         // 2. Build the TX as we did before
//         return await this.createCompliantTransfer(
//             this.provider.wallet.publicKey,
//             params.recipient,
//             USDC_MINT,
//             params.amount,
//             params.purpose,
//             senderRegion,
//             receiverRegion
//         );
//     }

//     public async createCompliantTransfer(
//         sender: PublicKey,
//         receiver: PublicKey,
//         mint: PublicKey,
//         amount: number,
//         category: string,
//         senderRegion: string,
//         receiverRegion: string
//     ): Promise<Transaction> {

//         const compliance = this.checkCompliance(
//             amount,
//             category,
//             senderRegion,
//             receiverRegion,
//             receiver.toBase58()
//         );

//         if (!compliance.isCompliant) {
//             throw new Error(compliance.error || "Compliance failed");
//         }

//         const tx = new Transaction();

//         // 🧾 Memo (UX only)
//         tx.add(
//             new TransactionInstruction({
//                 keys: [{ pubkey: sender, isSigner: true, isWritable: false }],
//                 data: Buffer.from(
//                     `Ctx:${category}|Out:${compliance.senderTax}|In:${compliance.receiverTax}`,
//                     "utf-8"
//                 ),
//                 programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
//             })
//         );

//         // 🔗 Resolve ATAs
//         const senderAta = await getAssociatedTokenAddress(mint, sender);
//         const receiverAta = await getAssociatedTokenAddress(mint, receiver);

//         const senderTreasury = TREASURY_MAP[senderRegion];
//         const receiverTreasury = TREASURY_MAP[receiverRegion];

//         if (!senderTreasury || !receiverTreasury) {
//             throw new Error("Unsupported region");
//         }

//         const senderTreasuryAta = await getAssociatedTokenAddress(mint, senderTreasury);
//         const receiverTreasuryAta = await getAssociatedTokenAddress(mint, receiverTreasury);

//         // 🔗 Contract call
//         const ix = await this.program.methods
//             .sendWithContext(
//                 new BN(amount),
//                 category,
//                 new BN(compliance.senderTax),
//                 new BN(compliance.receiverTax),
//                 senderRegion,
//                 receiverRegion
//             )
//             .accounts({
//                 sender: sender,
//                 senderTokenAccount: senderAta,
//                 receiverTokenAccount: receiverAta,
//                 receiver: receiver,
//                 senderTreasury: senderTreasuryAta,
//                 receiverTreasury: receiverTreasuryAta,
//                 tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
//             })
//             .instruction();

//         tx.add(ix);

//         return tx;
//     }
// }

import { Connection, PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { Program, AnchorProvider, Idl } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import BN from 'bn.js';
import idl from './compliance_router.json';

const PROGRAM_ID = new PublicKey("DMSJPGeWdenYtxCxqpEH2Jm9gJTSuacujo9doRDgaiSX");

// ✅ Using your newly minted custom USDC
const USDC_MINT = new PublicKey("2fJkJa8tZiPf39DmjJyK4zopi28c8r2VajWke3PnQsDW");

// Region → Treasury Mapping (IMPORTANT)
const TREASURY_MAP: Record<string, PublicKey> = {
    "US": new PublicKey("43MNuckFznmnCvzZcnKqmkHJH9PVcje4LSKwEWDj6Mkx"),
    "IN": new PublicKey("h8kNyEcqG7MTg2MxntFQ5V2P3qSCWBzBhzzjEajVmqn"),
};

export class StableComplianceSDK {
    private program: Program;
    private provider: AnchorProvider;

    constructor(connection: Connection) {
        const dummyWallet = {
            publicKey: PublicKey.default,
            signTransaction: async (tx: any) => tx,
            signAllTransactions: async (txs: any[]) => txs,
        };

        this.provider = new AnchorProvider(connection, dummyWallet as any, {});
        
        this.program = new Program(
            idl as unknown as Idl, 
            this.provider
        );
    }

    public checkCompliance(
        amount: number,
        category: string,
        senderRegion: string,
        receiverRegion: string,
        recipient: string
    ) {
        const BLACKLIST = ["7xkx...OFAC", "Hacker...Wallet"];

        if (BLACKLIST.includes(recipient)) {
            return { isCompliant: false, senderTax: 0, receiverTax: 0, error: "OFAC violation" };
        }

        let senderTax = 0;
        let receiverTax = 0;

        if (category === "Salary") {
            senderTax = amount * 0.05;
            receiverTax = amount * 0.10;
        } else if (category === "Vendor") {
            senderTax = amount * 0.03;
            receiverTax = amount * 0.05;
        }
        

        return { isCompliant: true, senderTax, receiverTax, error: null };
    }

    public async createAutoTransfer(params: {
        sender: PublicKey,
        amount: number,
        purpose: string,
        recipient: PublicKey
    }) {
        const senderRegion = "US";
        const receiverRegion = "IN";

        return await this.createCompliantTransfer(
            params.sender,
            params.recipient,
            USDC_MINT,
            params.amount,
            params.purpose,
            senderRegion,
            receiverRegion
        );
    }

    public async createCompliantTransfer(
        sender: PublicKey,
        receiver: PublicKey,
        mint: PublicKey,
        amount: number,
        category: string,
        senderRegion: string,
        receiverRegion: string
    ): Promise<Transaction> {

        const compliance = this.checkCompliance(
            amount,
            category,
            senderRegion,
            receiverRegion,
            receiver.toBase58()
        );

        if (!compliance.isCompliant) {
            throw new Error(compliance.error || "Compliance failed");
        }

        // --- SOLANA UNITS FIX (9 Decimals) ---
        // Solana doesn't understand "100 tokens", it only understands raw units (lamports).
        // Since your token has 9 decimals, 1 token = 1,000,000,000 raw units.
        const multiplier = Math.pow(10, 9); 
        const rawAmount = Math.floor(amount * multiplier);
        const rawSenderTax = Math.floor(compliance.senderTax * multiplier);
        const rawReceiverTax = Math.floor(compliance.receiverTax * multiplier);

        const tx = new Transaction();

        // 🧾 Memo (UX only)
        tx.add(
            new TransactionInstruction({
                keys: [{ pubkey: sender, isSigner: true, isWritable: false }],
                data: Buffer.from(
                    `Ctx:${category}|Out:${compliance.senderTax}|In:${compliance.receiverTax}`,
                    "utf-8"
                ),
                programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
            })
        );

        // 🔗 Resolve ATAs
        const senderAta = await getAssociatedTokenAddress(mint, sender);
        const receiverAta = await getAssociatedTokenAddress(mint, receiver);

        const senderTreasury = TREASURY_MAP[senderRegion];
        const receiverTreasury = TREASURY_MAP[receiverRegion];

        if (!senderTreasury || !receiverTreasury) {
            throw new Error("Unsupported region");
        }

        const senderTreasuryAta = await getAssociatedTokenAddress(mint, senderTreasury);
        const receiverTreasuryAta = await getAssociatedTokenAddress(mint, receiverTreasury);

        console.log("Pre-flight ATAs:", {
            senderAta: senderAta.toBase58(),
            receiverAta: receiverAta.toBase58(),
            senderTreasuryAta: senderTreasuryAta.toBase58(),
            receiverTreasuryAta: receiverTreasuryAta.toBase58()
        });

        // 🔗 Contract call (Notice we are passing the rawAmount and raw taxes here!)
        const ix = await this.program.methods
            .sendWithContext(
                new BN(rawAmount),
                category,
                new BN(rawSenderTax),
                new BN(rawReceiverTax),
                senderRegion,
                receiverRegion
            )
            .accounts({
                sender: sender,
                senderTokenAccount: senderAta,
                receiverTokenAccount: receiverAta,
                receiver: receiver,
                senderTreasury: senderTreasuryAta,
                receiverTreasury: receiverTreasuryAta,
                tokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            } as any)
            .instruction();

        tx.add(ix);

        console.log("Transaction built successfully:", tx);

        return tx;
    }
}