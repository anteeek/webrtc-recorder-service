//@ts-ignore
import * as wrtc from "wrtc";
Object.assign(global, wrtc);

export default function applyPolyfills() {
    Object.assign(global, wrtc);
}