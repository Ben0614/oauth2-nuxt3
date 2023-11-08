// 類型 (facebook和apple會需要)
export declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
    AppleID: any;
  }
}