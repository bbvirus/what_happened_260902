#!/usr/bin/env node
/**
 * 레이어 3 — 하드코딩 하드블록
 *
 * PreToolUse (Edit|Write|MultiEdit) 훅. stdin으로 훅 JSON을 받아
 * 토큰 외 시각 값이 들어오면 exit 2로 파일 쓰기를 차단한다.
 *
 * 규칙의 단일 진실 공급원: CLAUDE.md ## 토큰 규칙
 * 의존성 0. Node 표준 모듈만 사용한다.
 */

import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join, basename, extname } from 'node:path';

const TARGET_EXT = new Set(['.tsx', '.jsx', '.ts', '.js', '.css']);
const TOKENS_DIR = 'src/tokens';
const EXEMPT_MARK = 'token-exempt:';
const REM_BASE = 16;

/** 감지 규칙. filter가 있으면 매치 중 filter를 통과한 것만 위반으로 본다. */
const RULES = [
  {
    label: 'hex 색상',
    re: /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})\b/g,
  },
  {
    label: '함수형 색상',
    re: /\b(?:rgba?|hsla?)\s*\([^)]*\)/g,
  },
  {
    label: 'raw px',
    re: /(?<![\w-])\d+(?:\.\d+)?px\b/g,
  },
  {
    // Tailwind arbitrary value. data-[state=open] 같은 arbitrary "변형"은
    // 시각 값이 아니므로 괄호 안에 값(숫자/hex/색상함수)이 있을 때만 위반으로 본다.
    label: 'Tailwind arbitrary 값',
    re: /(?<![\w-])[a-z][a-z0-9]*(?:-[a-z0-9]+)*-\[[^\]]*\]/g,
    filter: (m) => {
      const inner = m.slice(m.indexOf('[') + 1, -1);
      return /[#\d]/.test(inner) || /rgba?\(|hsla?\(/.test(inner);
    },
  },
  {
    label: 'CSS 변수 직접 참조',
    re: /var\(\s*--[^)]*\)/g,
  },
];

/** --color-* 등 네임스페이스별로 어떤 유틸리티가 되는지 안내한다. */
const UTILITY_HINT = [
  ['--color-', (n) => `bg-${n} / text-${n} / border-${n}`],
  ['--spacing-', (n) => `p-${n} / gap-${n} / h-${n}`],
  ['--radius-', (n) => `rounded-${n}`],
  ['--text-', (n) => `text-${n}`],
  ['--shadow-', (n) => `shadow-${n}`],
  ['--font-weight-', (n) => `font-${n}`],
  ['--breakpoint-', (n) => `${n}: 변형`],
];

function hintFor(tokenName) {
  for (const [prefix, fn] of UTILITY_HINT) {
    if (tokenName.startsWith(prefix)) return fn(tokenName.slice(prefix.length));
  }
  return null;
}

/** 값 하나에서 비교용 키들을 만든다. #abc → #aabbcc, 0.75rem → 12px 도 함께. */
function normalizeKeys(value) {
  const v = value.trim().toLowerCase();
  const keys = new Set([v]);
  const hex3 = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(v);
  if (hex3) keys.add(`#${hex3[1]}${hex3[1]}${hex3[2]}${hex3[2]}${hex3[3]}${hex3[3]}`);
  const rem = /^(-?\d*\.?\d+)rem$/.exec(v);
  if (rem) keys.add(`${Number(rem[1]) * REM_BASE}px`);
  const px = /^(-?\d*\.?\d+)px$/.exec(v);
  if (px) keys.add(`${Number(px[1]) / REM_BASE}rem`);
  return [...keys];
}

/** src/tokens 의 모든 .css 를 파싱해 값 → 토큰 이름 맵을 만든다. */
function loadTokenMap(projectDir) {
  const map = new Map();
  const dir = resolve(projectDir, TOKENS_DIR);
  let files = [];
  try {
    files = readdirSync(dir).filter((f) => f.endsWith('.css'));
  } catch {
    /* 토큰 디렉터리가 아직 없어도 차단 자체는 동작해야 한다 */
  }
  for (const file of files) {
    let css;
    try {
      css = readFileSync(join(dir, file), 'utf8');
    } catch {
      continue;
    }
    for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
      const name = m[1];
      for (const key of normalizeKeys(m[2])) {
        if (!map.has(key)) map.set(key, []);
        if (!map.get(key).includes(name)) map.get(key).push(name);
      }
    }
  }
  return map;
}

/** 위반 값에 대응하는 토큰 안내 문구. */
function suggest(found, tokenMap) {
  const inner = found.includes('[') ? found.slice(found.indexOf('[') + 1, -1) : found;
  for (const key of normalizeKeys(inner)) {
    const names = tokenMap.get(key);
    if (names && names.length) {
      const name = names[0];
      const hint = hintFor(name);
      return hint ? `${name} 사용: ${hint}` : `${name} 사용`;
    }
  }
  return `대응 토큰 없음. ${TOKENS_DIR}/ 에 의미기반 이름으로 먼저 추가하세요 (색상은 colors.tokens.css).`;
}

function isExemptFile(filePath) {
  const base = basename(filePath);
  return base === 'design-tokens.css' || base.endsWith('.tokens.css');
}

function extractText(toolName, input) {
  if (toolName === 'Write') return { text: input.content ?? '', exact: true };
  if (toolName === 'Edit') return { text: input.new_string ?? '', exact: false };
  if (toolName === 'MultiEdit') {
    const edits = Array.isArray(input.edits) ? input.edits : [];
    return { text: edits.map((e) => e?.new_string ?? '').join('\n'), exact: false };
  }
  return null;
}

function main() {
  const raw = readFileSync(0, 'utf8');
  if (!raw.trim()) process.exit(0);

  let payload;
  try {
    payload = JSON.parse(raw);
  } catch {
    process.exit(0); // 입력을 못 읽으면 통과시킨다 (fail-open)
  }

  const toolName = payload?.tool_name ?? '';
  const input = payload?.tool_input ?? {};
  const filePath = typeof input.file_path === 'string' ? input.file_path : '';
  if (!filePath) process.exit(0);
  if (!TARGET_EXT.has(extname(filePath).toLowerCase())) process.exit(0);
  if (isExemptFile(filePath)) process.exit(0);

  const extracted = extractText(toolName, input);
  if (!extracted || !extracted.text) process.exit(0);

  const projectDir = payload?.cwd || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const tokenMap = loadTokenMap(projectDir);

  const violations = [];
  const seen = new Set();
  extracted.text.split('\n').forEach((line, i) => {
    if (line.includes(EXEMPT_MARK)) return;
    for (const rule of RULES) {
      for (const m of line.matchAll(rule.re)) {
        const found = m[0];
        if (rule.filter && !rule.filter(found)) continue;
        const key = `${i}:${found}`;
        if (seen.has(key)) continue;
        seen.add(key);
        violations.push({ line: i + 1, label: rule.label, found });
      }
    }
  });

  if (violations.length === 0) process.exit(0);

  const lineLabel = extracted.exact ? 'L' : '+L';
  const out = [
    '',
    '✖ 하드코딩 차단 — 레이어 3 (규칙: CLAUDE.md ## 토큰 규칙)',
    `  파일: ${filePath}`,
    '',
  ];
  for (const v of violations) {
    out.push(`  ${lineLabel}${v.line}  ${v.label}  ${v.found}`);
    out.push(`        → ${suggest(v.found, tokenMap)}`);
  }
  out.push(
    '',
    `  위반 ${violations.length}건. 파일 쓰기를 차단했습니다.`,
    '  · 토큰이 있으면 위 유틸리티 클래스로 바꾸세요.',
    `  · 없으면 ${TOKENS_DIR}/ 에 의미기반 이름으로 추가한 뒤 사용하세요. 순서를 뒤집지 마세요.`,
    '  · 불가피한 경우만 줄 끝에 /* token-exempt: <사유> */ (저장소 전체 5건 이하)',
    '',
  );
  if (!extracted.exact) {
    out.push('  (줄번호는 변경 내용 기준입니다. 파일 전체 줄번호와 다를 수 있습니다.)', '');
  }

  process.stderr.write(out.join('\n'));
  process.exit(2);
}

try {
  main();
} catch {
  process.exit(0); // 훅 자체 오류로 모든 편집이 막히는 것이 최악의 실패 모드다
}
