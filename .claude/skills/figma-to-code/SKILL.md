---
name: figma-to-code
description: Figma 링크나 노드 ID를 토큰 기반 React 컴포넌트로 구현한다. Figma 디자인을 코드로 옮길 때 사용한다. figma-implementer 에이전트를 호출한다.
---

# /figma-to-code

**이 작업을 인라인으로 하지 않는다.** 반드시 `Agent`(subagent_type: `figma-implementer`)를 호출한다.
직접 Figma MCP를 읽고 직접 구현하면 레이어 2(절차)가 우회된다.

## 절차

### 1. 입력 확인 (호출 전)

| 필요 | 없으면 |
|---|---|
| Figma 링크 또는 노드 ID | 사용자에게 묻는다. 추측하지 않는다 |
| 컴포넌트를 놓을 위치 | 기본값 `src/components/<Name>/` |

Figma MCP가 미인증이면(`authenticate`, `complete_authentication`만 보이면) 먼저 인증을 안내하고
**중단한다.** 에이전트를 호출해도 값을 읽을 수 없다.

### 2. 에이전트 호출

`Agent`를 `subagent_type: "figma-implementer"`로 호출한다. 프롬프트에 반드시 포함할 것:

- Figma 링크/노드 ID (원문 그대로)
- 컴포넌트 이름과 배치 경로
- 요청 범위 — 이 노드만인지, 하위 컴포넌트까지인지
- "토큰이 없으면 만들지 말고 `필요하지만 없는 토큰`으로 보고하라"

### 3. 반환 검증

에이전트 반환에 아래가 다 있는지 확인한다. 빠졌으면 다시 요청한다.

- 구현 파일 목록 · 사용 토큰 목록 · 필요하지만 없는 토큰 · 불명확한 값 · 검증 결과

`불명확한 값`이 비어 있지 않으면 **구현을 채택하지 않고** 그 목록을 사용자에게 질문으로 올린다.
`필요하지만 없는 토큰`이 있으면 `/sync-tokens`를 먼저 실행한다.

### 4. 검증 게이트

`/review-design`을 실행한다. **FAIL이면 완료를 선언하지 않는다.**
