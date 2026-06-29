This directory contains the offline electron-builder assets used by
`npm run release:win`.

Required local assets:
- `nsis/nsis-3.0.4.1`
- `nsis/nsis-resources-3.4.1`

The Windows release flow is configured to fail fast if these assets are
missing, rather than downloading them from the network at build time.
