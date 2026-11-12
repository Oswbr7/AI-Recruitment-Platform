import type { Candidate } from "@/features/candidates/models/Candidate";
import type { ExperienceLevel, Job } from "@/features/jobs/models/Job";

/**
 * Scoring determinístico candidato-vs-vacante. Es la "AI" del producto en
 * su versión explicable: mismas entradas -> mismos puntos, cada dimensión
 * es auditable en el desglose (nada de cajas negras). Vive en el cliente
 * siguiendo el patrón del Dashboard (agregación cross-feature con TanStack
 * Query + useMemo); si en el futuro el matching requiere datos que el
 * cliente no tiene (p.ej. parsing de CV), su lugar natural es un
 * matching-service backend y esta función migra sin cambios de firma.
 *
 * Pesos (total 100):
 *   location      25  remoto / misma ciudad
 *   experience    25  años de experiencia vs. nivel requerido
 *   salary        20  expectativa dentro del rango de la vacante
 *   pipeline      15  etapa del candidato (más arriba en el pipeline = mejor fit)
 *   keywords      15  solapamiento de términos headline/posición vs. título/descripción
 */
export interface MatchBreakdown {
    total: number;
    location: number;
    experience: number;
    salary: number;
    pipeline: number;
    keywords: number;
}

export interface CandidateMatch {
    candidate: Candidate;
    score: number;
    breakdown: MatchBreakdown;
}

/** Años de experiencia que exige cada nivel de vacante (umbrales didácticos). */
const REQUIRED_YEARS: Record<ExperienceLevel, number> = {
    EntryLevel: 0,
    Junior: 1,
    MidLevel: 3,
    Senior: 5,
    Lead: 8,
    Executive: 10,
};

/** Puntos por etapa del pipeline: prioriza candidatos recién entrados. */
const STAGE_POINTS: Record<string, number> = {
    Applied: 15,
    Screening: 12,
    TechnicalInterview: 8,
    HRInterview: 5,
    Offer: 2,
    Hired: 0,
    Rejected: 0,
};

/** Tokens con significado (descarta "con", "and", "the", ruido corto...). */
function tokens(text: string | undefined): string[] {
    if (!text) return [];
    return text
        .toLowerCase()
        .split(/[^a-záéíóúñü0-9]+/)
        .filter((t) => t.length >= 4);
}

function scoreLocation(job: Job, candidate: Candidate): number {
    if (job.remoteType === "Remote") {
        // La vacante es remota: cualquier ubicación sirve, conocida o no.
        return candidate.location ? 20 : 15;
    }

    const jobTokens = tokens(job.location);
    const candidateTokens = tokens(candidate.location);

    if (jobTokens.length === 0 || candidateTokens.length === 0) {
        return 5;
    }

    return candidateTokens.some((t) => jobTokens.includes(t)) ? 25 : 5;
}

function scoreExperience(job: Job, candidate: Candidate): number {
    if (!job.experienceLevel) return 10; // vacante sin nivel: neutral

    const required = REQUIRED_YEARS[job.experienceLevel];
    const years = candidate.yearsOfExperience;

    if (years == null) return 10; // dato ausente: neutral
    if (years >= required) return 25;
    if (years >= required - 1) return 15;
    return 5;
}

function scoreSalary(job: Job, candidate: Candidate): number {
    const expected = candidate.expectedSalary;

    if (expected == null) return 10; // dato ausente: neutral
    if (job.salaryMin == null && job.salaryMax == null) return 10; // rango abierto: neutral

    const withinMin = job.salaryMin == null || expected >= job.salaryMin;
    const withinMax = job.salaryMax == null || expected <= job.salaryMax;

    if (withinMin && withinMax) return 20;
    if (!withinMin) return 10; // pide menos de lo ofrecido: negociable
    return 5; // pide más del techo: riesgo de fuga
}

function scorePipeline(candidate: Candidate): number {
    return STAGE_POINTS[candidate.stage] ?? 0;
}

function scoreKeywords(job: Job, candidate: Candidate): number {
    const jobTokens = new Set([
        ...tokens(job.title),
        ...tokens(job.department),
        ...tokens(job.description),
    ]);
    const candidateTokens = new Set([
        ...tokens(candidate.headline),
        ...tokens(candidate.currentPosition),
        ...tokens(candidate.summary),
    ]);

    if (jobTokens.size === 0 || candidateTokens.size === 0) return 0;

    let overlap = 0;
    for (const token of candidateTokens) {
        if (jobTokens.has(token)) overlap++;
    }

    return Math.min(15, overlap * 5);
}

export function scoreCandidate(job: Job, candidate: Candidate): MatchBreakdown {
    const location = scoreLocation(job, candidate);
    const experience = scoreExperience(job, candidate);
    const salary = scoreSalary(job, candidate);
    const pipeline = scorePipeline(candidate);
    const keywords = scoreKeywords(job, candidate);

    return {
        total: location + experience + salary + pipeline + keywords,
        location,
        experience,
        salary,
        pipeline,
        keywords,
    };
}

export function rankCandidates(job: Job, candidates: Candidate[]): CandidateMatch[] {
    return candidates
        .map((candidate) => ({
            candidate,
            score: 0, // se rellena con el breakdown
            breakdown: scoreCandidate(job, candidate),
        }))
        .map((match) => ({ ...match, score: match.breakdown.total }))
        .sort((a, b) => b.score - a.score);
}
