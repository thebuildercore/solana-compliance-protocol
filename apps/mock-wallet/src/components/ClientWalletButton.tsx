'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

// Dynamically import the wallet button so it ONLY loads on the client
const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false } // This tells Next.js to skip Server-Side Rendering for this button
);

export function ClientWalletButton({ style }: { style?: React.CSSProperties }) {
    const [mounted, setMounted] = useState(false);

    // Ensure the component is fully mounted in the browser before rendering
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        // Render a placeholder button that matches the exact shape while loading
        return (
            <button style={{
                ...style,
                background: '#111827',
                color: '#fff',
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                height: 32,
                padding: '0 14px',
                border: 'none'
            }}>
                Loading...
            </button>
        );
    }

    return <WalletMultiButtonDynamic style={style} />;
}