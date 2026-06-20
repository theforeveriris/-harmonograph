import { originalRose, multiFreqRose } from './rose';
import { lissajous } from './lissajous';
import { cardioidHeart, butterflyCurve } from './heart';
import { trefoilKnot, kleinBottle } from './topology';
import { epitrochoid, hypocycloid, astroid } from './trochoid';
import { superellipse } from './morphing';
import { sineWaveRing } from './wave';
import { lemniscateOfBernoulli, limacon } from './polar';
import { conicEllipse } from './conic';
import { spirograph, maclaurinRose } from './spirograph';
import { maurerRose } from './special';
import { figureEight } from './orbital';
import { starPolygon } from './geometric';
import { nephroid, deltoid, cardioidPolar } from './classic';
import { rhodonea, sunflower } from './flower';
import { torusKnot, lissajousKnot } from './knot';
import { hypotrochoidRose, witchOfAgnesi, talbotCurve } from './exotic';

export const animations = [
  // Rose / 玫瑰
  originalRose,
  multiFreqRose,
  rhodonea,
  maclaurinRose,
  maurerRose,
  // Heart / 心形
  cardioidHeart,
  butterflyCurve,
  // Knot / 纽结
  trefoilKnot,
  kleinBottle,
  torusKnot,
  lissajousKnot,
  figureEight,
  lemniscateOfBernoulli,
  // Trochoid / 摆轮
  epitrochoid,
  hypocycloid,
  astroid,
  nephroid,
  deltoid,
  spirograph,
  starPolygon,
  // Curve / 曲线
  sineWaveRing,
  superellipse,
  limacon,
  conicEllipse,
  sunflower,
  lissajous,
  // Classic / 经典
  cardioidPolar,
  // Exotic / 异形
  hypotrochoidRose,
  witchOfAgnesi,
  talbotCurve,
];
