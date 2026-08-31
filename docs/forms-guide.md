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
- Define the schema in the parent form component, or colocate it (e.g. `MyForm/formSchema.ts`) when section components need the types.
- Use `useForm` with `zodResolver(schema)` in the parent.
- Each section component receives `form` as a prop.

---

## Schema and validation

- Use Zod schemas for every form; export the values type: `export type FormValues = z.infer<typeof schema>;`
- Use `zodResolver(schema)` with `useForm`.

### Where to put the schema file

- **Colocate** the schema when it is used by a single form. Place it next to the form, e.g. `MyForm/formSchema.ts`, and import it in the form and any section components that need the types.
- **Move to utils** when the schema is shared by multiple forms. Place it in `apps/web-app/utils/` (or equivalent) so all forms can import from the same module.

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
import type { MyFormValues } from "../MyForm/MyForm";

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
