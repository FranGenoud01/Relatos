// Similitud de texto por trigramas de caracteres (Jaccard). Barato de calcular
// y suficiente para detectar "mismo relato reescrito" en textos largos, sin
// necesitar Levenshtein completo (O(n*m), caro para párrafos).

export const SIMILARITY_THRESHOLD = 0.5;

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, ' ').trim();
}

function getTrigrams(text: string): Set<string> {
  const normalized = normalize(text);
  const trigrams = new Set<string>();

  if (normalized.length < 3) {
    if (normalized.length > 0) trigrams.add(normalized);
    return trigrams;
  }

  for (let i = 0; i <= normalized.length - 3; i++) {
    trigrams.add(normalized.slice(i, i + 3));
  }

  return trigrams;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;

  let intersection = 0;
  for (const trigram of a) {
    if (b.has(trigram)) intersection++;
  }

  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export interface SimilarityCandidate {
  id: number;
  text: string;
}

export interface SimilarityMatch {
  examId: number;
  score: number;
}

export function findMostSimilarExam(
  newText: string,
  candidates: SimilarityCandidate[]
): SimilarityMatch | null {
  const newTrigrams = getTrigrams(newText);
  let best: SimilarityMatch | null = null;

  for (const candidate of candidates) {
    const score = jaccardSimilarity(newTrigrams, getTrigrams(candidate.text));
    if (!best || score > best.score) {
      best = { examId: candidate.id, score };
    }
  }

  return best;
}
