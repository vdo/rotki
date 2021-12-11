import { BTC_INPUT, ETH_INPUT, XMR_INPUT } from '@/components/accounts/const';

type EthInput = typeof ETH_INPUT[number];
type BtcInput = typeof BTC_INPUT[number];
type XmrInput = typeof XMR_INPUT[number];

export type AccountInput = EthInput | BtcInput | XmrInput;
