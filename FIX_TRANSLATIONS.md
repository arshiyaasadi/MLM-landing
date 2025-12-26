# راهنمای رفع مشکل نمایش متن‌ها

## مشکل
متن‌های صفحه نمایش داده نمی‌شدند و console پر از خطاهای "Translation key not found" بود.

## علت مشکل
1. استفاده از template strings در تابع `t()` که باعث می‌شد TypeScript type checking دور زده شود
2. تابع `t()` یک object برمی‌گرداند به جای string وقتی که از template string استفاده می‌شود

## تغییرات انجام شده

### 1. BentoGrid.tsx
**قبل:**
```typescript
const cardData = t(`bentoGrid.cards.${card.key}`)
```

**بعد:**
```typescript
const translations = t('bentoGrid.cards') as any
const cardData = translations[card.key]
```

### 2. Faqs.tsx
**قبل:**
```typescript
const faqData = t(`faqs.items.${faq.key}`)
```

**بعد:**
```typescript
const faqsItems = t('faqs.items') as any
const faqData = faqsItems[faq.key]
```

### 3. MLMEngine.tsx
**قبل:**
```typescript
const stepData = t(`mlmEngine.steps.step${index + 1}`)
```

**بعد:**
```typescript
const mlmSteps = t('mlmEngine.steps') as any
const stepData = mlmSteps[`step${index + 1}`]
```

### 4. StakingPools.tsx
**قبل:**
```typescript
const poolData = t(`stakingPools.${pool.key}`)
```

**بعد:**
```typescript
const stakingPools = t('stakingPools') as any
const poolData = stakingPools[pool.key]
```

### 5. Layout.tsx
اضافه شدن `pt-16` به main برای جلوگیری از پنهان شدن محتوا زیر header ثابت:
```typescript
<main className="flex-auto pt-16">{children}</main>
```

## نتیجه
✅ تمام متن‌ها حالا به درستی نمایش داده می‌شوند
✅ بدون خطای linter
✅ Console تمیز بدون warning

## توضیح فنی
هوک `useTranslation` فقط با کلیدهای literal string کار می‌کند تا TypeScript بتواند type checking انجام دهد. وقتی از template string استفاده می‌کنیم، TypeScript نمی‌تواند path را validate کند و تابع یک object برمی‌گرداند به جای string.

راه حل: ابتدا parent object را دریافت کنید و سپس به صورت dynamic به property دسترسی پیدا کنید.

