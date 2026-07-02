# 7월 프로모션 온톨로지 구조화 변경 설계

## 목적

7월 프로모션 정책을 앱의 가격 계산 온톨로지에 명확히 반영한다. 기존의 "반값할인 + 동시할인" 구조를 제거하고, 신규 렌탈 수량과 결합할인 토글 상태만으로 혜택을 결정한다.

## 확정 정책

| 조건 | 적용 할인 | UI 문구 | 반값/동시할인 |
|---|---:|---|---|
| 신규 렌탈 1개, 결합할인 토글 OFF | 0% | 표시 없음 | 미적용 |
| 신규 렌탈 1개, 결합할인 토글 ON | 5% | 결합할인 5% | 미적용 |
| 신규 렌탈 2개 이상 | 15% | 7월 15%(2개이상) | 미적용 |

2개 이상 렌탈 시 결합할인 토글이 ON이어도 15% 단일 할인만 적용한다. 15%와 5%는 중복 적용하지 않는다.

재렌탈 모드는 이번 변경 범위에서 제외한다. 기존 재렌탈 1~12개월 20%, 이후 10%/13%/16% 구조를 유지한다.

## 현재 구조 요약

주 정책 결정 위치는 `index.html`의 `getRentalBenefitDecision`이다. 이 함수가 `discountRate`, `halfMonths`, `discountLabel`, `halfLabel`, `benefitLabel`, `reasonCode`를 반환하고, `_getDetailedPricingByCareImpl`이 반환값을 월 렌탈료와 총납입 계산에 적용한다.

현재 코드에는 6월 정책 흔적이 남아 있다.

- `PROMOTION_FREE_MONTHS`
- `halfMonths`
- `festaMonths`
- `반값 혜택`
- `6월 동시+반값`
- `2개 이상 10% + 반값`

7월 정책에서는 이 값들이 계산 결과에 영향을 주면 안 된다.

## 권장 구조

`getRentalBenefitDecision`은 7월 정책 기준으로 아래 형태의 혜택 객체를 반환한다.

```js
{
  discountRate: 0.15,
  rerentalRestRate: 0,
  halfMonths: 0,
  discountLabel: '7월 15%(2개이상)',
  halfLabel: '',
  benefitLabel: '7월 15%(2개이상)',
  reasonCode: 'july_multi_15'
}
```

1개 렌탈의 결합할인 토글 ON 케이스는 아래처럼 반환한다.

```js
{
  discountRate: 0.05,
  rerentalRestRate: 0,
  halfMonths: 0,
  discountLabel: '결합할인 5%',
  halfLabel: '',
  benefitLabel: '결합할인 5%',
  reasonCode: 'single_bundle_5'
}
```

1개 렌탈의 결합할인 토글 OFF 케이스는 할인 라벨을 비운다.

```js
{
  discountRate: 0,
  rerentalRestRate: 0,
  halfMonths: 0,
  discountLabel: '',
  halfLabel: '',
  benefitLabel: '기본 렌탈',
  reasonCode: 'single_none'
}
```

## 계산 흐름

`newUnitsCount`는 기존 구조를 유지한다.

```js
const newUnitsCount = mQtyInt + fQtyInt + extraQtyTotal;
```

`hasExistingCoway`도 기존 결합할인 토글 의미를 유지하되, 7월 정책에서는 1개 렌탈일 때만 5% 판단에 사용한다.

```js
const hasExistingCoway = !!isCross;
```

기존 `aprilCount`는 7월 프로모션 계산에 사용하지 않는 것이 안전하다. "사용자가 5% 결합할인 토글 ON일 때 적용"이라는 지시에 맞추려면, 과거 보유 수량 state가 자동으로 5%를 켜면 안 된다.

`_getDetailedPricingByCareImpl`의 월 렌탈료 계산식은 유지한다.

```js
mPkgD = Math.ceil((prePkg * discountRate) / 10) * 10;
mFinal = Math.max(0, prePkg - mPkgD);
```

프레임과 추가 제품도 같은 `discountRate`를 공유한다. 7월 정책에서 `halfMonths`는 항상 0이므로 기존 `promoAmount` 계산식은 결과적으로 0이 된다.

## UI 표시 설계

2개 이상 신규 렌탈이면 모든 할인 라벨은 `7월 15%(2개이상)`로 통일한다.

적용 위치:

- 장바구니 요약 할인 프로그레스
- 장바구니 상세 할인 내역
- 추가 제품 할인 안내
- 워터폴/도넛 할인 상세
- SMS/복사 견적 할인 라인
- 프로모션 안내 배지와 안내 모달

제거 또는 비표시 대상:

- `반값 혜택`
- `처음 N개월`
- `6월 동시+반값`
- `2개 이상 10%`
- `10% + 반값`
- `PROMOTION_FREE_MONTHS` 기반 안내 문구

결합할인 토글 UI는 유지한다. 단, 설명은 "1개 렌탈 시 적용" 의미가 드러나야 한다. 2개 이상 렌탈 상태에서는 토글이 켜져 있어도 가격과 할인 라벨은 15% 기준으로만 보여야 한다.

## 저장 견적과 정책 버전

`RENTAL_POLICY_VERSION`은 `2026-07-rental-benefit-v1`로 변경한다. 저장 견적은 정책 버전이 다르면 현재 정책으로 재계산하는 기존 구조를 따른다.

## 테스트 설계

`scripts/verify_promo_policy.js`는 7월 정책으로 갱신한다.

필수 케이스:

| 신규 렌탈 수량 | 결합 토글 | 기대 할인율 | 기대 halfMonths | 기대 라벨 |
|---:|---|---:|---:|---|
| 1 | OFF | 0 | 0 | 빈 문자열 |
| 1 | ON | 0.05 | 0 | 결합할인 5% |
| 2 | OFF | 0.15 | 0 | 7월 15%(2개이상) |
| 2 | ON | 0.15 | 0 | 7월 15%(2개이상) |
| 3 | OFF | 0.15 | 0 | 7월 15%(2개이상) |

`scripts/verify_promo_notice_ui.js`는 6월 문구를 금지하고 7월 문구를 요구하게 바꾼다.

필수 금지 문구:

- `6월 동시+반값`
- `반값 혜택`
- `2대 이상 10%`
- `10% + 반값`

필수 포함 문구:

- `7월 15%(2개이상)`
- `결합할인 5%`

## 구현 범위

수정 대상:

- `index.html`
- `CALC_LOGIC.md`
- `DEV_RULES.md`
- `scripts/verify_promo_policy.js`
- `scripts/verify_promo_notice_ui.js`

구현하지 않는 것:

- 재렌탈 정책 변경
- 제휴카드 정책 변경
- 제품 가격표 변경
- 장바구니 구조 개편
- 별도 파일로 정책 엔진 분리

## 수동 검증 기준

구현 후에는 기존 규칙대로 모바일 프리뷰에서 검증한다.

1. 신규 렌탈 1개, 결합 토글 OFF: 반값 문구가 없고 추가 할인이 없어야 한다.
2. 신규 렌탈 1개, 결합 토글 ON: `결합할인 5%`만 보여야 한다.
3. 신규 렌탈 2개 이상: `7월 15%(2개이상)`만 보여야 한다.
4. 신규 렌탈 2개 이상 + 결합 토글 ON: 5%가 중복 표시되거나 중복 계산되면 안 된다.
5. 장바구니, 도넛, SMS 복사 문구에서 반값/동시할인 문구가 남아 있으면 안 된다.

## 승인 포인트

이 설계는 7월 정책을 다음 한 문장으로 고정한다.

신규 렌탈 2개 이상은 `7월 15%(2개이상)`, 신규 렌탈 1개는 사용자가 결합할인 토글을 ON 했을 때만 `결합할인 5%`를 적용하며, 반값할인과 동시할인은 적용하지 않는다.
