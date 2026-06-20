/** Parameter definition for an animation */
export interface ParamDef {
  key: string;
  label: string;
  labelZh?: string;
  type: 'range' | 'color' | 'number' | 'text';
  min?: number;
  max?: number;
  step?: number;
  val: number | string;
}

/** A 2D point with optional depth for 3D projections */
export interface Point2D {
  x: number;
  y: number;
  depth?: number;
}

/** A particle rendered on the SVG */
export interface Particle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  color?: string;
}

/** Live configuration values keyed by param key */
export type LiveConfig = Record<string, number | string>;

/** The animation definition interface */
export interface AnimationDef {
  id: string;
  category: string;
  categoryZh: string;
  name: string;
  nameZh: string;
  tag: string;
  params: ParamDef[];
  /** Generate formula text from current config */
  formula: (cfg: LiveConfig) => string;
  /** Compute a point on the curve */
  point: (progress: number, time: number, cfg: LiveConfig) => Point2D;
  /** Get rotation angle for the SVG group */
  getRotation: (time: number, cfg: LiveConfig) => number;
  /** Build the full SVG path string (optional steps for resolution control) */
  buildPath: (time: number, cfg: LiveConfig, steps?: number) => string;
  /** Compute a particle's position and appearance */
  getParticle: (index: number, progress: number, time: number, cfg: LiveConfig) => Particle;
  /** Return the source code snippet */
  code: (cfg: LiveConfig) => string;
  /** Optional: cache for expensive computations (e.g. L-system) */
  cache?: Record<string, string>;
  /** Optional: extra methods for specific animations */
  getSequence?: (cfg: LiveConfig) => string;
  /** Optional: graph nodes for graph-based animations */
  nodes?: Array<{ x: number; y: number }>;
  /** Optional: graph edges for graph-based animations */
  edges?: Array<[number, number]>;
}
