# Forms guide

> **Purpose**: Patterns for building forms with Mantine and Zod in the web app. **Web app only** — do not use Mantine in the mobile app.

## Overview

Forms in this project use:

- **Mantine** `useForm` for state and validation
- **Zod** for all form validation via `mantine-form-zod-resolver` — use Zod schemas for every form

---

## Form structure

### When to split into section components

Keep forms in a single file when practical. The general rule is max ~300 lines per file (applies to all components, not just forms). If a form grows beyond that, extract sections into separate components that receive `form` as a prop. Section heading style (e.g. `Title order={3}`) follows the design — there is no fixed rule.

If you do split:

- Put the schema in `apps/web-app/utils/` and import it from `@/utils` in the parent and any section components that need the types.
- Use `useForm` with `zodResolver(schema)` in the parent.
- Each section component receives `form` as a prop.

---

## Schema and validation

- Use Zod schemas for every form; export the values type: `export type FormValues = z.infer<typeof schema>;`
- Use `zodResolver(schema)` with `useForm`.

### Where to put the schema file

- **Web-only forms:** `apps/web-app/utils/`, named after the form (e.g. `addBuildingSchema.ts`). Export from `utils/index.ts`. Test in `utils/__tests__/`. Import from `@/utils`.
- **Shared by web and mobile:** `packages/shared`.
- Do not put a schema file in a component folder. That folder is only the component, its test, and an optional skeleton.

---

## Section components (when extracted)

When form sections are extracted into separate components:

- Each section component receives `form: UseFormReturnType<YourFormValues>`.
- Use `form.getInputProps("fieldName")` for controlled inputs.
- Use `form.setFieldValue` when needed (e.g. dropdown with "Add new" option).
- Use Mantine inputs: `TextInput`, `Textarea`, `Select`, `NumberInput`, `Checkbox`, etc.
- For required fields, use Mantine's `withAsterisk` prop only (Zod handles validation; do not use `required` which adds HTML5 validation). Do not use manual asterisk spans.

---

## Testing form section components

When testing section components that receive a form prop, mock the form with correct typing:

```tsx
import type { UseFormReturnType } from "@mantine/form";
import type { MyFormValues } from "@/utils";

const mockForm = {
  getInputProps: (name: string) => ({ name }),
  values: { title: "", description: "", ... },
  errors: {},
  setFieldValue: jest.fn(),
} as unknown as UseFormReturnType<MyFormValues>;
```

Cast as `UseFormReturnType<YourFormValues>` so component prop types match.

---

## See also

- [Component building guide](./component-building-guide.md)
- [Component organization guide](./component-organization-guide.md)
- Mantine Form: https://mantine.dev/form/use-form/
- mantine-form-zod-resolver: https://www.npmjs.com/package/mantine-form-zod-resolver
