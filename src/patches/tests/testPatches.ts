/** Monkey patches SharedArrayBuffer to be used in tests */
export function patchSharedArrayBuffer(): void {
  // SharedArrayBuffer requires content served with COEP, COOP, and CORP headers
  // however, when the Karma server serves assets not bundled in the main.js
  // file, they are not served with the headers in the karma.conf.js file
  //
  // so that we have an instance of SharedArrayBuffer, I have monkey patched
  // the SharedArrayBuffer to be the same as ArrayBuffer
  // this will break the cross origin functionality of the SharedArrayBuffer
  // therefore, any tests that assert the functionality of shared buffers
  // across workers will not work
  window.SharedArrayBuffer = window.ArrayBuffer as any;
}
