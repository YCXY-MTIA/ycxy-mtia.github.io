declare module 'ogl' {
  export interface RendererOptions {
    dpr?: number;
    alpha?: boolean;
    antialias?: boolean;
    canvas?: HTMLCanvasElement;
  }

  export class Renderer {
    constructor(options?: RendererOptions);
    gl: WebGLRenderingContext & { canvas: HTMLCanvasElement };
    dpr: number;
    setSize(width: number, height: number): void;
    render(options: { scene: unknown; camera?: unknown }): void;
  }

  export interface ProgramOptions {
    vertex: string;
    fragment: string;
    uniforms?: Record<string, { value: number | number[] }>;
  }

  export class Program {
    constructor(gl: WebGLRenderingContext, options: ProgramOptions);
  }

  export class Triangle {
    constructor(gl: WebGLRenderingContext);
  }

  export class Mesh {
    constructor(gl: WebGLRenderingContext, options: { geometry: Triangle; program: Program });
  }
}
