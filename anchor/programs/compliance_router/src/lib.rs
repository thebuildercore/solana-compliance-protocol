use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

//  Replace AFTER deploy
declare_id!("DMSJPGeWdenYtxCxqpEH2Jm9gJTSuacujo9doRDgaiSX");

#[program]
pub mod compliance_router {
    use super::*;

    pub fn send_with_context(
        ctx: Context<SendWithContext>,
        amount: u64,
        category: String,
        sender_tax: u64,
        receiver_tax: u64,
        sender_region: String,
        receiver_region: String,
    ) -> Result<()> {

        // ----------------------------
        // 🔒 VALIDATIONS
        // ----------------------------

        require!(amount > 0, ErrorCode::InvalidAmount);

        let total_tax = sender_tax
            .checked_add(receiver_tax)
            .ok_or(ErrorCode::MathOverflow)?;

        require!(total_tax <= amount, ErrorCode::InvalidTax);

        // Sender must own token account
        require!(
            ctx.accounts.sender_token_account.owner == ctx.accounts.sender.key(),
            ErrorCode::InvalidOwner
        );

        // Token mint consistency (VERY IMPORTANT)
        require!(
            ctx.accounts.sender_token_account.mint == ctx.accounts.receiver_token_account.mint,
            ErrorCode::InvalidMint
        );

        require!(
            ctx.accounts.sender_token_account.mint == ctx.accounts.sender_treasury.mint,
            ErrorCode::InvalidMint
        );

        require!(
            ctx.accounts.sender_token_account.mint == ctx.accounts.receiver_treasury.mint,
            ErrorCode::InvalidMint
        );

        // ----------------------------
        // 💸 TRANSFER LOGIC
        // ----------------------------

        let net_amount = amount
            .checked_sub(total_tax)
            .ok_or(ErrorCode::MathOverflow)?;

        let token_program = ctx.accounts.token_program.to_account_info();

        // 1. Send net to receiver
        token::transfer(
            CpiContext::new(
                token_program.clone(),
                Transfer {
                    from: ctx.accounts.sender_token_account.to_account_info(),
                    to: ctx.accounts.receiver_token_account.to_account_info(),
                    authority: ctx.accounts.sender.to_account_info(),
                },
            ),
            net_amount,
        )?;

        // 2. Sender tax → sender treasury
        if sender_tax > 0 {
            token::transfer(
                CpiContext::new(
                    token_program.clone(),
                    Transfer {
                        from: ctx.accounts.sender_token_account.to_account_info(),
                        to: ctx.accounts.sender_treasury.to_account_info(),
                        authority: ctx.accounts.sender.to_account_info(),
                    },
                ),
                sender_tax,
            )?;
        }

        // 3. Receiver tax → receiver treasury
        if receiver_tax > 0 {
            token::transfer(
                CpiContext::new(
                    token_program,
                    Transfer {
                        from: ctx.accounts.sender_token_account.to_account_info(),
                        to: ctx.accounts.receiver_treasury.to_account_info(),
                        authority: ctx.accounts.sender.to_account_info(),
                    },
                ),
                receiver_tax,
            )?;
        }

        // ----------------------------
        // 📡 EVENT (ON-CHAIN AUDIT)
        // ----------------------------

        emit!(CompliantTransferEvent {
            sender: ctx.accounts.sender.key(),
            receiver: ctx.accounts.receiver.key(),
            amount,
            category,
            sender_tax,
            receiver_tax,
            sender_region,
            receiver_region,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct SendWithContext<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,

    #[account(mut)]
    pub sender_token_account: Account<'info, TokenAccount>,

    #[account(mut)]
    pub receiver_token_account: Account<'info, TokenAccount>,

    /// ✅ Explicit receiver
    pub receiver: SystemAccount<'info>,

    /// ✅ Sender country treasury
    #[account(mut)]
    pub sender_treasury: Account<'info, TokenAccount>,

    /// ✅ Receiver country treasury
    #[account(mut)]
    pub receiver_treasury: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,
}

#[event]
pub struct CompliantTransferEvent {
    pub sender: Pubkey,
    pub receiver: Pubkey,
    pub amount: u64,
    pub category: String,
    pub sender_tax: u64,
    pub receiver_tax: u64,
    pub sender_region: String,
    pub receiver_region: String,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid transfer amount")]
    InvalidAmount,

    #[msg("Tax exceeds total amount")]
    InvalidTax,

    #[msg("Sender does not own token account")]
    InvalidOwner,

    #[msg("Math overflow")]
    MathOverflow,

    #[msg("Token mint mismatch")]
    InvalidMint,
}