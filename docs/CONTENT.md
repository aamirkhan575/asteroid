# Editing content

All text lives in **`src/content/en.ts`** and **`src/content/ar.ts`**. Business facts live in
**`src/config/site.ts`**. You never need to touch components to change words.

## Contact details

`src/config/site.ts`:

```ts
contact: {
  phoneDisplay: "+971 55 283 0119",  // what people see
  phoneE164:    "+971552830119",     // tel: links + structured data
  whatsapp:     "971552830119",      // wa.me links (digits only)
  email:        "hi@asteroid.design",
}
```

Changing these updates every button, the footer, the terminal, structured data and the link helpers
in one go. Also update `public/llms.txt`, `public/humans.txt` and Google Business Profile so the NAP
stays identical everywhere.

## Copy

- Both dictionaries share the `Dictionary` type (`content/types.ts`). If you add a field to one,
  TypeScript makes you add it to the other.
- Headlines with an orange serif word use `{ pre, accent, post }`:
  ```ts
  title: { pre: "Clear prices. ", accent: "No surprises." }
  ```
- **SEO title & description** are in `meta`. Keep titles under ~60 characters and descriptions under ~155.
- **WhatsApp pre-filled messages** (`waMessage`) are per language.

## Pricing

Prices (numbers) are in `config/site.ts → pricing.plans`. Plan names, features and labels are in the
dictionaries (`pricing.plans`, in the same order). The structured data offers update automatically.

## Portfolio projects

1. Add an entry to `work.projects` in **both** dictionaries (`id`, `name`, `url`, `category`,
   `description`). Add the `id` to the union in `content/types.ts`.
2. Add a preview to `src/components/sections/work/previews.tsx` under the same `id`. You can copy an
   existing one, or replace it with a `next/image` screenshot (set `width`/`height` to avoid layout shift).
3. Add the project to `public/llms.txt`.

## FAQ

Add or edit `faq.items` (`{ q, a }`). The visible FAQ and the `FAQPage` structured data both read from
this list, so they can't drift apart.

## Arabic notes

- Write natural Modern Standard Arabic (or a Gulf-friendly tone). Have a native copywriter review it.
- Use Western digits for prices and phone numbers (common in the UAE). Phone numbers are wrapped in
  `dir="ltr"` automatically.
- Arabic letters must never be split for animations (they join cursively). The hero splits Arabic by
  word, not by letter.
