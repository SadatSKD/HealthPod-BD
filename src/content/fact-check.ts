export type FactCheck = {
  status: 'pending' | 'verified';
  toolModel?: string; date?: string; originalPrompt?: string; exactIncorrectClaim?: string;
  originalEvidence?: string; whyIncorrect?: string; correction?: string; statute?: string;
  section?: string; officialUrl?: string; reviewedAt?: string; reviewer?: string;
};

export const factCheck: FactCheck = { status: 'pending' };
