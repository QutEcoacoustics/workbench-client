(function(){"use strict";const u="buffer-builder-processor";function o(s){const e=f(s);return new Promise(t=>setTimeout(t,e))}function f(s){return s*1e3}var n=(s=>(s[s.BUFFER_AVAILABLE=0]="BUFFER_AVAILABLE",s[s.BUFFER_WRITE_HEAD=1]="BUFFER_WRITE_HEAD",s[s.WORKER_STATE=2]="WORKER_STATE",s[s.GENERATION=3]="GENERATION",s[s.PROCESSOR_READY=4]="PROCESSOR_READY",s[s.PROCESSOR_COMPLETE=5]="PROCESSOR_COMPLETE",s))(n||{});const c=-1;class i{static createState(){const e=new SharedArrayBuffer(Object.keys(n).length/2*Int32Array.BYTES_PER_ELEMENT),t=new i(e);return t.processorReadyGeneration=c,t.processorCompleteGeneration=c,t}constructor(e){this.state=new Int32Array(e)}get stateBuffer(){return this.state.buffer}get bufferAvailable(){return Atomics.load(this.state,0)===1}set bufferAvailable(e){Atomics.store(this.state,0,e),Atomics.notify(this.state,0,e)}get bufferWriteHead(){return Atomics.load(this.state,1)}set bufferWriteHead(e){Atomics.store(this.state,1,e)}get workerNew(){return Atomics.load(this.state,2)===0}get workerIdle(){return Atomics.load(this.state,2)===1}get workerProcessing(){return Atomics.load(this.state,2)===2}set workerProcessing(e){Atomics.store(this.state,2,e),Atomics.notify(this.state,2,e)}get generation(){return Atomics.load(this.state,3)}get processorReadyGeneration(){return Atomics.load(this.state,4)}set processorReadyGeneration(e){Atomics.store(this.state,4,e)}get processorCompleteGeneration(){return Atomics.load(this.state,5)}set processorCompleteGeneration(e){Atomics.store(this.state,5,e)}isProcessorReady(e){return Atomics.load(this.state,4)===e}isProcessorComplete(e){return Atomics.load(this.state,5)===e}processorComplete(e){const t=this.processorCompleteGeneration;e>t&&(this.processorCompleteGeneration=e),e===t+1&&(this.bufferAvailable=1)}reset(){const t=Atomics.add(this.state,3,1)+1;return this.bufferWriteHead=0,this.bufferAvailable=0,t}matchesCurrentGeneration(e){return Atomics.load(this.state,3)===e}async waitForProcessorReady(e){for(;this.processorReadyGeneration<e;)await o(0);return this.matchesCurrentGeneration(e)}async waitForWorkerReady(){for(;this.workerNew;)await o(0)}async waitForWorkerIdle(){for(;!this.workerIdle;)await o(0)}}class l extends i{processorReady(e){const t=this.processorReadyGeneration;return e>t&&(this.processorReadyGeneration=e),e>t}busyWaitForWorkerToProcessBuffer(e){for(;this.bufferAvailable&&this.matchesCurrentGeneration(e););}bufferReady(){this.bufferAvailable=1}}class d extends AudioWorkletProcessor{constructor(){super(),this.aborted=!1,this.tag="processor:",this.port.onmessage=this.handleMessage.bind(this)}process(e){if(this.aborted)return!1;const t=e[0][0];let r=this.state.bufferWriteHead;const h=this.buffer.length;let a=r+t.length;return a>=h&&(this.state.bufferReady(),this.state.busyWaitForWorkerToProcessBuffer(this.generation),r=this.state.bufferWriteHead,a=r+t.length),this.needsToAbort()?!1:(this.buffer.set(t,r),this.state.bufferWriteHead=a,!0)}needsToAbort(){return this.state.matchesCurrentGeneration(this.generation)?!1:(this.aborted=!0,!0)}handleMessage(e){if(e.data[0]==="setup"){const t=e.data[1],r=t.generation;this.state=new l(t.state),this.buffer=new Float32Array(t.sampleBuffer),this.generation=r,this.tag=`processor (${r}):`,this.state.processorReady(r)||(console.error(this.tag,"Processor not valid, aborting"),this.aborted=!0)}else throw new Error("Unknown message type")}}registerProcessor(u,d)})();
