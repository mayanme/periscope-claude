// Declaration for the direct file import used to bypass pdf-parse's test file loader
declare module "pdf-parse/lib/pdf-parse.js" {
  function pdfParse(
    dataBuffer: Buffer | Uint8Array,
    options?: object
  ): Promise<{ text: string; numpages: number; info: object }>;
  export = pdfParse;
}
