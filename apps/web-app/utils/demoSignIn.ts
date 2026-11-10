export const DEMO_LOCK_MESSAGE = "This demo can't save changes.";

export interface DemoSignInAccount {
  label: string;
  email: string;
  password: string;
}

const DEMO_PEOPLE = [
  {
    label: "Continue as Ama Boateng, staff",
    email: "ama.boateng@ridgeway.gh",
    passwordKey: "staffPassword",
  },
  {
    label: "Continue as Naa Densua Lamptey, owner",
    email: "naa.lamptey@ridgeway.gh",
    passwordKey: "ownerPassword",
  },
  {
    label: "Continue as Aba Gyamfi, tenant",
    email: "aba.gyamfi@ridgeway.gh",
    passwordKey: "tenantPassword",
  },
] as const;

export function isPublicDemo(lock: string | undefined): boolean {
  return lock === "on";
}

export function blockDemoSave(
  writesLocked: boolean,
  report: (message: string) => void
): boolean {
  if (!writesLocked) {
    return false;
  }
  report(DEMO_LOCK_MESSAGE);
  return true;
}

export function demoSignInAccounts(passwords: {
  staffPassword?: string;
  ownerPassword?: string;
  tenantPassword?: string;
}): DemoSignInAccount[] {
  return DEMO_PEOPLE.flatMap((person) => {
    const password = passwords[person.passwordKey]?.trim() ?? "";
    if (password.length === 0) {
      return [];
    }
    return [
      {
        label: person.label,
        email: person.email,
        password,
      },
    ];
  });
}
