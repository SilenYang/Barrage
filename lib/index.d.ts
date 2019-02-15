type barrageType = "normal" | "avatar";
type sendType = "normal" | "up" | "down";

interface BarrageItem {
  text: string;
  avatar?: string;
  type?: barrageType;
  color?: string;
  gradientColor?: string;
  borderColor?: string;
  sendType?: sendType;
}

interface BarrageConf {
  el?: any;
  fontSize?: Number;
  color?: String;
  opacity?: Number;
  renderArea?: "full" | "up" | "down";
  standingTime?: Number;
  fixNormal?: Boolean;
}

interface Barrage {
  id: Number;
  move: Boolean;
  show: Boolean;
  el: any;
  distance: Number;
  left: Number;
  channel: Number;
  width: Number;
  type: barrageType;
  style: String;
  sendType: sendType;
}

declare var Barrages: Barrage[];

export class Barrage {
  constructor(config: BarrageConf);
  Conf: BarrageConf;
  send(config: BarrageItem): void;
  update(config: BarrageConf): void;
  pause(): void;
  dispose(): void;
}

export function createBarrage(config: BarrageItem): void;
