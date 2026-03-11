import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import type { ConflictReportItem, LegacyMediaReference, LegacyReferenceFilePath } from "./types";

export const MISSING_VALUE = "__MISSING__";

type UnknownRecord = Record<string, unknown>;

export function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function prettifyIdentifier(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function sanitizeText(value: unknown): string {
  const normalized = typeof value === "string" ? value : value === null || value === undefined ? "" : String(value);
  return normalized
    .replace(/\s+/g, " ")
    .replace(/â€™|Ã¢â‚¬â„¢/g, "'")
    .replace(/â€‘|Ã¢â‚¬â€˜/g, "-")
    .trim();
}

export function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter((value) => value.length > 0))];
}

export function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "string" ? sanitizeText(item) : ""))
    .filter((item) => item.length > 0);
}

export function readLegacyReferenceFile(relativePath: LegacyReferenceFilePath): string {
  const absolutePath = path.resolve(process.cwd(), relativePath);
  return readFileSync(absolutePath, "utf8");
}

export function ensureDirectory(directoryPath: string): void {
  mkdirSync(directoryPath, { recursive: true });
}

export function writeJsonFile(filePath: string, payload: unknown): void {
  const parentDirectory = path.dirname(filePath);
  ensureDirectory(parentDirectory);
  writeFileSync(filePath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

export function toMediaReference(id: string, sourcePath: string): LegacyMediaReference {
  return {
    id,
    sourcePath,
  };
}

export function extractImportMap(content: string): Record<string, string> {
  const importMap: Record<string, string> = {};
  const importRegex = /^import\s+([A-Za-z_$][\w$]*)\s+from\s+["']([^"']+)["'];?/gm;
  let match: RegExpExecArray | null = importRegex.exec(content);

  while (match) {
    const identifier = match[1];
    const sourcePath = match[2];
    if (identifier && sourcePath) {
      importMap[identifier] = sourcePath;
    }
    match = importRegex.exec(content);
  }

  return importMap;
}

function findMatchingBracket(input: string, startIndex: number): number {
  const opening = input[startIndex] ?? "";
  const closing = opening === "{" ? "}" : opening === "[" ? "]" : "";
  if (!closing) {
    return -1;
  }

  let depth = 0;
  let index = startIndex;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplate = false;
  let inLineComment = false;
  let inBlockComment = false;
  let escaped = false;

  while (index < input.length) {
    const current = input[index] ?? "";
    const next = input[index + 1] ?? "";

    if (inLineComment) {
      if (current === "\n") {
        inLineComment = false;
      }
      index += 1;
      continue;
    }

    if (inBlockComment) {
      if (current === "*" && next === "/") {
        inBlockComment = false;
        index += 2;
        continue;
      }
      index += 1;
      continue;
    }

    if (inSingleQuote || inDoubleQuote || inTemplate) {
      if (escaped) {
        escaped = false;
        index += 1;
        continue;
      }

      if (current === "\\") {
        escaped = true;
        index += 1;
        continue;
      }

      if (inSingleQuote && current === "'") {
        inSingleQuote = false;
      } else if (inDoubleQuote && current === '"') {
        inDoubleQuote = false;
      } else if (inTemplate && current === "`") {
        inTemplate = false;
      }

      index += 1;
      continue;
    }

    if (current === "/" && next === "/") {
      inLineComment = true;
      index += 2;
      continue;
    }

    if (current === "/" && next === "*") {
      inBlockComment = true;
      index += 2;
      continue;
    }

    if (current === "'") {
      inSingleQuote = true;
      index += 1;
      continue;
    }

    if (current === '"') {
      inDoubleQuote = true;
      index += 1;
      continue;
    }

    if (current === "`") {
      inTemplate = true;
      index += 1;
      continue;
    }

    if (current === opening) {
      depth += 1;
    } else if (current === closing) {
      depth -= 1;
      if (depth === 0) {
        return index;
      }
    }

    index += 1;
  }

  return -1;
}

export function extractConstLiteral(content: string, constName: string): string | null {
  const declarationRegex = new RegExp(`\\bconst\\s+${constName}\\s*=`, "m");
  const declarationMatch = declarationRegex.exec(content);

  if (!declarationMatch) {
    return null;
  }

  let index = declarationMatch.index + declarationMatch[0].length;
  while (index < content.length && /\s/.test(content[index] ?? "")) {
    index += 1;
  }

  const opening = content[index] ?? "";
  if (!opening) {
    return null;
  }

  if (opening === "[" || opening === "{") {
    const closingIndex = findMatchingBracket(content, index);
    if (closingIndex < 0) {
      return null;
    }
    return content.slice(index, closingIndex + 1);
  }

  const semicolonIndex = content.indexOf(";", index);
  if (semicolonIndex < 0) {
    return null;
  }
  return content.slice(index, semicolonIndex).trim();
}

export function evaluateLiteral<T>(literal: string, context: Record<string, unknown> = {}): T {
  const sandbox: UnknownRecord = { ...context };
  const vmContext = vm.createContext(sandbox);
  const script = new vm.Script(`(${literal})`);
  return script.runInContext(vmContext, { timeout: 5000 }) as T;
}

export function evaluateConstLiteral<T>(
  content: string,
  constName: string,
  context: Record<string, unknown> = {},
): T | null {
  const literal = extractConstLiteral(content, constName);
  if (!literal) {
    return null;
  }
  return evaluateLiteral<T>(literal, context);
}

export function firstMatch(content: string, pattern: RegExp): string {
  const match = content.match(pattern);
  if (!match) {
    return "";
  }

  const selected = match[1] ?? match[0];
  return sanitizeText(selected);
}

export function collectMatches(content: string, pattern: RegExp): string[] {
  const results: string[] = [];
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const globalPattern = new RegExp(pattern.source, flags);
  let match = globalPattern.exec(content);

  while (match) {
    const value = match[1] ?? match[0];
    const normalized = sanitizeText(value);
    if (normalized) {
      results.push(normalized);
    }
    match = globalPattern.exec(content);
  }

  return results;
}

export function normalizeSpecRows(rawValue: unknown): Array<{ specLabel: string; specValue: string }> {
  if (!Array.isArray(rawValue)) {
    return [];
  }

  const rows: Array<{ specLabel: string; specValue: string }> = [];
  rawValue.forEach((entry) => {
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return;
    }

    const record = entry as UnknownRecord;
    const explicitLabel = typeof record.label === "string" ? sanitizeText(record.label) : "";
    const explicitValue = typeof record.value === "string" ? sanitizeText(record.value) : "";

    if (explicitLabel || explicitValue) {
      rows.push({
        specLabel: explicitLabel || MISSING_VALUE,
        specValue: explicitValue || MISSING_VALUE,
      });
      return;
    }

    Object.entries(record).forEach(([label, value]) => {
      if (typeof value !== "string") {
        return;
      }

      const normalizedLabel = sanitizeText(label);
      const normalizedValue = sanitizeText(value);
      if (!normalizedLabel && !normalizedValue) {
        return;
      }

      rows.push({
        specLabel: normalizedLabel || MISSING_VALUE,
        specValue: normalizedValue || MISSING_VALUE,
      });
    });
  });

  return rows;
}

export function normalizeApplications(value: unknown): { materials: string[]; industries: string[] } {
  if (Array.isArray(value)) {
    return {
      materials: uniqueStrings(toStringArray(value)),
      industries: [],
    };
  }

  if (!value || typeof value !== "object") {
    return {
      materials: [],
      industries: [],
    };
  }

  const record = value as UnknownRecord;
  return {
    materials: uniqueStrings(toStringArray(record.materials)),
    industries: uniqueStrings(toStringArray(record.industries)),
  };
}

export function asString(value: unknown): string {
  return typeof value === "string" ? sanitizeText(value) : "";
}

export function buildConflict(
  item: Omit<ConflictReportItem, "id"> & { id?: string },
  indexHint: number,
): ConflictReportItem {
  return {
    id: item.id ?? `conflict-${indexHint}`,
    severity: item.severity,
    title: item.title,
    description: item.description,
    sourceFiles: item.sourceFiles,
    fieldPaths: item.fieldPaths,
    suggestedAction: item.suggestedAction,
  };
}
