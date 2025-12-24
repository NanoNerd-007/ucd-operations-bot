export function extractAmount(message: string): number | null {
    const amountRegex = /\d+(\.\d{1,2})?/
    return Number(message.match(amountRegex)?.[0] ?? null);
}