export const METAMASK_IMPORT = 'metamask_import';
export const MANUAL_ADD = 'manual_add';
export const XPUB_ADD = 'xpub_add';
export const XMR_ADD = 'rpc_add';

export const ETH_INPUT = [MANUAL_ADD, METAMASK_IMPORT] as const;
export const BTC_INPUT = [MANUAL_ADD, XPUB_ADD] as const;
export const XMR_INPUT = [XMR_ADD] as const;
