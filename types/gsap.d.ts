/**
 * Type definitions for GSAP SplitText plugin
 * 
 * Note: SplitText is a premium plugin from GSAP
 * Make sure you have a valid license or use gsap-trial for testing
 */

declare module 'gsap/SplitText' {
  export class SplitText {
    constructor(
      target: Element | string | null,
      vars?: {
        type?: string;
        smartWrap?: boolean;
        autoSplit?: boolean;
        linesClass?: string;
        wordsClass?: string;
        charsClass?: string;
        reduceWhiteSpace?: boolean;
        onSplit?: (self: SplitText) => gsap.core.Tween | void;
      }
    );

    chars: Element[];
    words: Element[];
    lines: Element[];

    revert(): void;
    split(vars?: any): void;
  }
}
