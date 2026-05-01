# Tiny🐣Wallet

A fully browser-based, no-download, no-install crypto wallet MVP with a fun childish design.

**No app. No extension. Just your wallet in the browser!**

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Tech Stack

- **Vite + Preact** — fast, lightweight SPA
- **Tailwind CSS** — utility-first styling with custom playful theme
- **@preact/signals** — reactive state management
- **WebCrypto API** — AES-256-GCM encryption with PBKDF2 key derivation
- **IndexedDB** — local encrypted storage

## Architecture

```
src/
├── app.jsx              # Router / page switcher
├── main.jsx             # Entry point
├── index.css            # Tailwind + custom component styles
├── data/
│   ├── networks.js      # Network definitions (BTC, ETH, AVAX, etc.)
│   └── defaultAssets.js # Default token lists & wallet presets
├── lib/
│   ├── crypto.js        # AES-GCM encrypt/decrypt via WebCrypto
│   ├── storage.js       # IndexedDB wrapper
│   ├── wallet.js        # Wallet creation, save, load, export
│   └── state.js         # Preact signals global state
├── components/
│   ├── AddAsset.jsx     # Add token flow (EVM/Solana/UTXO)
│   ├── AssetList.jsx    # Token balance list
│   ├── DerivationPathTool.jsx # Advanced path management
│   ├── Header.jsx       # Navigation header
│   ├── Modal.jsx        # Reusable modal
│   ├── NetworkCard.jsx  # Network card for dashboard grid
│   ├── SecurityBadge.jsx # Security indicators
│   ├── Toast.jsx        # Toast notifications
│   └── Warning.jsx      # Warning/danger dialogs
└── pages/
    ├── Landing.jsx      # Landing / unlock screen
    ├── CreateWallet.jsx # Create wallet flow (4 steps)
    ├── RestoreWallet.jsx # Restore from mnemonic
    ├── Dashboard.jsx    # Main dashboard with network cards grid
    ├── NetworkDetail.jsx # Network detail with tabs
    ├── Send.jsx         # Send crypto flow
    ├── Receive.jsx      # Receive / show address
    ├── Swap.jsx         # Swap placeholder
    ├── FindFunds.jsx    # Find old funds scanner
    └── Settings.jsx     # All settings
```

## Supported Networks

| Network | Symbol | Type | Derivation Path |
|---------|--------|------|-----------------|
| Bitcoin | BTC | UTXO | m/84'/0'/0'/0/i |
| Ethereum | ETH | EVM | m/44'/60'/0'/0/i |
| Avalanche | AVAX | EVM | m/44'/60'/0'/0/i |
| Arbitrum | ETH | EVM | m/44'/60'/0'/0/i |
| Solana | SOL | Solana | m/44'/501'/i'/0' |
| BNB Chain | BNB | EVM | m/44'/60'/0'/0/i |
| Dogecoin | DOGE | UTXO | m/44'/3'/0'/0/i |
| Zcash | ZEC | UTXO | m/44'/133'/0'/0/i |

## Security Model

- Private keys are generated and stored **only in the browser**
- Wallet data is encrypted with **AES-256-GCM** using a password-derived key (PBKDF2, 100k iterations)
- **No server communication** — everything runs client-side
- Password required for signing transactions and revealing mnemonics
- Encrypted backup export supported

## What's Implemented

- [x] Landing / unlock screen
- [x] Create wallet flow (mnemonic generation, backup confirmation, password)
- [x] Restore wallet from mnemonic
- [x] Dashboard with responsive network cards grid
- [x] Network detail page with tabs (Assets, History, Add Asset, Advanced)
- [x] Send flow with validation and confirmation
- [x] Receive flow with address display
- [x] Swap placeholder UI
- [x] Find Funds scanner UI
- [x] Settings (lock, change password, export backup, reveal mnemonic, clear data)
- [x] IndexedDB encrypted storage
- [x] WebCrypto AES-256-GCM encryption
- [x] Advanced derivation path tools
- [x] Add custom token flow
- [x] Security badges and warnings
- [x] Mobile-first responsive design

## What's Mocked / TODO

- [ ] Real mnemonic generation (BIP39)
- [ ] Real key derivation (BIP32/BIP44)
- [ ] Blockchain RPC integration for balance fetching
- [ ] Transaction signing and broadcasting
- [ ] QR code generation and scanning
- [ ] Token auto-detection via contract address
- [ ] Real swap integration (LI.FI / SwapKit)
- [ ] Balance scanning in Find Funds flow
- [ ] Session auto-lock timer
- [ ] Dark mode toggle
- [ ] Encrypted QR backup/restore
- [ ] Test network support

## Build for Production

```bash
npm run build
npm run preview
```

Output goes to `dist/` — deploy to any static hosting.
