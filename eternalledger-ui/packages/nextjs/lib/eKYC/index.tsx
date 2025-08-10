// packages/nextjs/lib/eKYC/index.ts
// Stub until real ML code arrives
export async function verify(idFile: File, selfieBlob: Blob): Promise<boolean> {
  console.log("eKYC stub: received", idFile.name, selfieBlob.size);
  // 80 % random success for demo
  return new Promise((res) => setTimeout(() => res(Math.random() < 0.5), 500));
}