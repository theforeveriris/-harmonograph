declare module 'gif.js' {
  interface GIFOptions {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    background?: string;
    repeat?: number;
    dither?: string | boolean;
    transparent?: string | null;
  }

  interface GIFFrame {
    data: ImageData;
    delay: number;
    dispose?: number;
  }

  class GIF {
    constructor(options: GIFOptions);
    addFrame(image: HTMLCanvasElement | HTMLImageElement | HTMLVideoElement | ImageData | GIFFrame, delay?: number): void;
    on(event: 'progress' | 'finished' | 'abort', callback: (data?: Blob) => void): void;
    render(): void;
    abort(): void;
  }

  export default GIF;
}
