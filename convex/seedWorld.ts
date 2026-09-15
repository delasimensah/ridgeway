export const ORGANIZATION_NAME = "Ridgeway Property Group";

export const SEED_RENT_START = "2024-10";
export const SEED_RENT_END = "2026-09";

export const STAFF_AMA = {
  email: "ama.boateng@ridgeway.gh",
  displayName: "Ama Boateng",
  phone: "+233244110001",
} as const;

export const STAFF_PEOPLE = [
  STAFF_AMA,
  {
    email: "kweku.addo@ridgeway.gh",
    displayName: "Kweku Addo",
    phone: "+233244110002",
  },
] as const;

export const FIELD_PEOPLE = [
  {
    email: "yaw.sarpong@ridgeway.gh",
    displayName: "Yaw Sarpong",
    phone: "+233244220001",
  },
  {
    email: "esi.tetteh@ridgeway.gh",
    displayName: "Esi Tetteh",
    phone: "+233244220002",
  },
] as const;

export const OWNER_LAMPTEY = {
  email: "naa.lamptey@ridgeway.gh",
  displayName: "Naa Densua Lamptey",
  phone: "+233244330001",
  currency: "GHS" as const,
};

export const OWNER_ASANTE = {
  email: "kojo.asante@ridgeway.gh",
  displayName: "Kojo Asante",
  phone: "+233244330002",
  currency: "USD" as const,
};

export const OWNER_QUAYE = {
  email: "efua.quaye@ridgeway.gh",
  displayName: "Efua Quaye",
  phone: "+233244330003",
  currency: "GHS" as const,
};

export const OWNER_PEOPLE = [OWNER_LAMPTEY, OWNER_ASANTE, OWNER_QUAYE] as const;

export const TENANT_ABA = {
  email: "aba.gyamfi@ridgeway.gh",
  displayName: "Aba Gyamfi",
} as const;

export const TENANT_NII = {
  email: "nii.blankson@ridgeway.gh",
  displayName: "Nii Blankson",
} as const;

export const TENANT_SERWAA = {
  email: "serwaa.appiah@ridgeway.gh",
  displayName: "Serwaa Appiah",
} as const;

export const TENANT_KOFI = {
  email: "kofi.opoku@ridgeway.gh",
  displayName: "Kofi Opoku",
} as const;

export type SeedCurrency = "GHS" | "USD";
export type SeedPayer = "steady" | "late" | "uneven";

export type SeedTenant = {
  displayName: string;
  email: string;
  phone?: string;
  startedOn: string;
  endedOn?: string;
  rentMajor: number;
  dueDay: number;
  login?: boolean;
  payer?: SeedPayer;
};

export type SeedUnit = {
  label: string;
  kind: "apartment" | "commercial";
  leases: SeedTenant[];
};

export type SeedBuilding = {
  ownerEmail: string;
  name: string;
  street: string;
  area: string;
  houseRules: string;
  units: SeedUnit[];
};

export type SeedTicket = {
  buildingName: string;
  unitLabel: string;
  description: string;
  category: "plumbing" | "electrical" | "other";
  urgency: "low" | "normal" | "high";
  status: "received" | "assigned" | "scheduled" | "done";
  assigneeEmail?: string;
  scheduledFor?: string;
  note?: string;
};

const YAW = FIELD_PEOPLE[0].email;
const ESI = FIELD_PEOPLE[1].email;

export const BUILDINGS: SeedBuilding[] = [
  {
    ownerEmail: OWNER_LAMPTEY.email,
    name: "Ridge Court",
    street: "14 Ridge Road",
    area: "Cantonments",
    houseRules:
      "Quiet hours run from 10pm to 6am. Visitors sign in at the gate. Do not store gas cylinders on balconies. Report water leaks to the office the same day.",
    units: [
      {
        label: "B12",
        kind: "apartment",
        leases: [
          {
            displayName: TENANT_ABA.displayName,
            email: TENANT_ABA.email,
            phone: "+233244550001",
            startedOn: "2024-02-01",
            rentMajor: 6500,
            dueDay: 5,
            login: true,
            payer: "uneven",
          },
        ],
      },
      {
        label: "B14",
        kind: "apartment",
        leases: [
          {
            displayName: "Kwabena Frimpong",
            email: "kwabena.frimpong@ridgeway.gh",
            phone: "+233244550002",
            startedOn: "2024-06-01",
            rentMajor: 5500,
            dueDay: 1,
            payer: "steady",
          },
        ],
      },
      {
        label: "B16",
        kind: "apartment",
        leases: [
          {
            displayName: "Akua Bonsu",
            email: "akua.bonsu@ridgeway.gh",
            phone: "+233244550003",
            startedOn: "2025-01-15",
            rentMajor: 7200,
            dueDay: 10,
            payer: "steady",
          },
        ],
      },
      {
        label: "A4",
        kind: "apartment",
        leases: [
          {
            displayName: TENANT_KOFI.displayName,
            email: TENANT_KOFI.email,
            phone: "+233244550004",
            startedOn: "2023-09-01",
            endedOn: "2026-06-30",
            rentMajor: 5000,
            dueDay: 5,
            login: true,
            payer: "steady",
          },
        ],
      },
      {
        label: "A6",
        kind: "apartment",
        leases: [
          {
            displayName: "Maame Acheampong",
            email: "maame.acheampong@ridgeway.gh",
            phone: "+233244550005",
            startedOn: "2024-10-01",
            rentMajor: 4800,
            dueDay: 5,
            payer: "late",
          },
        ],
      },
      {
        label: "SH1",
        kind: "commercial",
        leases: [
          {
            displayName: "Fiifi Ankrah",
            email: "fiifi.ankrah@ridgeway.gh",
            phone: "+233244550006",
            startedOn: "2025-02-01",
            rentMajor: 18000,
            dueDay: 1,
            payer: "steady",
          },
        ],
      },
    ],
  },
  {
    ownerEmail: OWNER_LAMPTEY.email,
    name: "Roman Ridge House",
    street: "7 Liberation Road",
    area: "Roman Ridge",
    houseRules:
      "The compound gate closes at 11pm. Park only in your marked bay. No cooking with charcoal on the stairs. Post notices on the board in the lobby, not on doors.",
    units: [
      {
        label: "1A",
        kind: "apartment",
        leases: [
          {
            displayName: "Yaa Sarpong",
            email: "yaa.sarpong@ridgeway.gh",
            startedOn: "2024-05-01",
            rentMajor: 4200,
            dueDay: 5,
          },
        ],
      },
      {
        label: "1B",
        kind: "apartment",
        leases: [
          {
            displayName: "Papa Adu",
            email: "papa.adu@ridgeway.gh",
            startedOn: "2024-11-01",
            rentMajor: 4000,
            dueDay: 10,
          },
        ],
      },
      { label: "2A", kind: "apartment", leases: [] },
      {
        label: "2B",
        kind: "apartment",
        leases: [
          {
            displayName: "Adjoa Gyasi",
            email: "adjoa.gyasi@ridgeway.gh",
            startedOn: "2025-03-01",
            rentMajor: 4500,
            dueDay: 1,
            payer: "uneven",
          },
        ],
      },
    ],
  },
  {
    ownerEmail: OWNER_LAMPTEY.email,
    name: "Abelemkpe Courts",
    street: "22 Abelemkpe Road",
    area: "Abelemkpe",
    houseRules:
      "Children may play in the courtyard until 7pm. Do not wash cars with the borehole without asking the caretaker. Keep the shared drying lines clear by Sunday evening.",
    units: [
      {
        label: "A1",
        kind: "apartment",
        leases: [
          {
            displayName: "Nana Osei",
            email: "nana.osei@ridgeway.gh",
            startedOn: "2024-01-01",
            rentMajor: 3800,
            dueDay: 5,
          },
        ],
      },
      {
        label: "A2",
        kind: "apartment",
        leases: [
          {
            displayName: "Esi Danso",
            email: "esi.danso@ridgeway.gh",
            startedOn: "2025-06-01",
            rentMajor: 3900,
            dueDay: 15,
          },
        ],
      },
      { label: "B1", kind: "apartment", leases: [] },
      {
        label: "B2",
        kind: "apartment",
        leases: [
          {
            displayName: "Kojo Amponsah",
            email: "kojo.amponsah@ridgeway.gh",
            startedOn: "2024-08-01",
            rentMajor: 4100,
            dueDay: 1,
            payer: "late",
          },
        ],
      },
    ],
  },
  {
    ownerEmail: OWNER_ASANTE.email,
    name: "Airport West Residences",
    street: "18 Senchi Street",
    area: "Airport Residential",
    houseRules:
      "The generator runs from 8pm when ECG is off. Do not hang laundry on the front elevation. Deliveries wait at the security post. Pets stay on a lead in the gardens.",
    units: [
      {
        label: "3A",
        kind: "apartment",
        leases: [
          {
            displayName: TENANT_NII.displayName,
            email: TENANT_NII.email,
            phone: "+233244660001",
            startedOn: "2024-04-01",
            rentMajor: 1500,
            dueDay: 1,
            login: true,
            payer: "steady",
          },
        ],
      },
      {
        label: "3B",
        kind: "apartment",
        leases: [
          {
            displayName: "Akosua Vanderpuye",
            email: "akosua.vanderpuye@ridgeway.gh",
            startedOn: "2024-09-01",
            rentMajor: 1200,
            dueDay: 5,
          },
        ],
      },
      { label: "3C", kind: "apartment", leases: [] },
      {
        label: "3D",
        kind: "apartment",
        leases: [
          {
            displayName: "Kwame Amoah",
            email: "kwame.amoah@ridgeway.gh",
            startedOn: "2025-01-01",
            rentMajor: 1800,
            dueDay: 1,
            payer: "uneven",
          },
        ],
      },
    ],
  },
  {
    ownerEmail: OWNER_ASANTE.email,
    name: "East Legon Gardens",
    street: "5 Lagos Avenue",
    area: "East Legon",
    houseRules:
      "Use the service road for moving furniture. No parties in the gardens after 9pm. The pool is for residents only. Lock the pedestrian gate behind you after dark.",
    units: [
      {
        label: "G1",
        kind: "apartment",
        leases: [
          {
            displayName: "Efua Adjei",
            email: "efua.adjei@ridgeway.gh",
            startedOn: "2024-03-01",
            rentMajor: 1400,
            dueDay: 1,
          },
        ],
      },
      {
        label: "G2",
        kind: "apartment",
        leases: [
          {
            displayName: "Kweku Poku",
            email: "kweku.poku@ridgeway.gh",
            startedOn: "2024-12-01",
            rentMajor: 1100,
            dueDay: 10,
            payer: "late",
          },
        ],
      },
      {
        label: "G3",
        kind: "apartment",
        leases: [
          {
            displayName: "Abena Asare",
            email: "abena.asare@ridgeway.gh",
            startedOn: "2025-04-01",
            rentMajor: 1250,
            dueDay: 5,
          },
        ],
      },
      { label: "G4", kind: "apartment", leases: [] },
      {
        label: "G5",
        kind: "apartment",
        leases: [
          {
            displayName: "Selorm Agbo",
            email: "selorm.agbo@ridgeway.gh",
            startedOn: "2024-07-01",
            rentMajor: 1600,
            dueDay: 1,
            payer: "uneven",
          },
        ],
      },
    ],
  },
  {
    ownerEmail: OWNER_ASANTE.email,
    name: "Dzorwulu Place",
    street: "9 Dzorwulu Crescent",
    area: "Dzorwulu",
    houseRules:
      "Bins go out on Tuesday morning. Do not block the driveway with a second car. The borehole is for the building, not for tankers. Speak to the office before installing a dish.",
    units: [
      {
        label: "D1",
        kind: "apartment",
        leases: [
          {
            displayName: "Dzifa Klutse",
            email: "dzifa.klutse@ridgeway.gh",
            startedOn: "2024-02-15",
            rentMajor: 1100,
            dueDay: 5,
          },
        ],
      },
      {
        label: "D2",
        kind: "apartment",
        leases: [
          {
            displayName: "Elikem Agbenyega",
            email: "elikem.agbenyega@ridgeway.gh",
            startedOn: "2025-05-01",
            rentMajor: 950,
            dueDay: 15,
          },
        ],
      },
      { label: "D3", kind: "apartment", leases: [] },
    ],
  },
  {
    ownerEmail: OWNER_QUAYE.email,
    name: "Labone Walk-up",
    street: "32 Labone Crescent",
    area: "Labone",
    houseRules:
      "Stairs stay clear of shoes and plants. Music through walls after 9pm is not allowed. Pay the waste levy with rent. Call the caretaker before a plumber you hired arrives.",
    units: [
      {
        label: "C1",
        kind: "apartment",
        leases: [
          {
            displayName: "Jojo Quartey",
            email: "jojo.quartey@ridgeway.gh",
            startedOn: "2024-04-01",
            rentMajor: 4300,
            dueDay: 1,
          },
        ],
      },
      {
        label: "C2",
        kind: "apartment",
        leases: [
          {
            displayName: TENANT_SERWAA.displayName,
            email: TENANT_SERWAA.email,
            phone: "+233244770001",
            startedOn: "2024-08-01",
            rentMajor: 4500,
            dueDay: 5,
            login: true,
            payer: "uneven",
          },
        ],
      },
      { label: "C3", kind: "apartment", leases: [] },
      {
        label: "C4",
        kind: "apartment",
        leases: [
          {
            displayName: "Aba Lartey",
            email: "aba.lartey@ridgeway.gh",
            startedOn: "2025-02-01",
            rentMajor: 4700,
            dueDay: 10,
            payer: "late",
          },
        ],
      },
    ],
  },
  {
    ownerEmail: OWNER_QUAYE.email,
    name: "Osu Oxford House",
    street: "11 Oxford Street",
    area: "Osu",
    houseRules:
      "Shop shutters close by 9pm unless the office has approved later hours. Do not leave goods in the shared corridor. The upstairs flats keep the street door latched after 8pm.",
    units: [
      {
        label: "1A",
        kind: "apartment",
        leases: [
          {
            displayName: "Nii Odartey",
            email: "nii.odartey@ridgeway.gh",
            startedOn: "2024-06-01",
            rentMajor: 3600,
            dueDay: 5,
          },
        ],
      },
      {
        label: "1B",
        kind: "apartment",
        leases: [
          {
            displayName: "Mansa Tagoe",
            email: "mansa.tagoe@ridgeway.gh",
            startedOn: "2024-10-01",
            rentMajor: 3500,
            dueDay: 1,
            payer: "uneven",
          },
        ],
      },
      { label: "1C", kind: "apartment", leases: [] },
      {
        label: "SH1",
        kind: "commercial",
        leases: [
          {
            displayName: "Kojo Nortey",
            email: "kojo.nortey@ridgeway.gh",
            startedOn: "2024-01-01",
            rentMajor: 12000,
            dueDay: 1,
          },
        ],
      },
      { label: "SH2", kind: "commercial", leases: [] },
    ],
  },
  {
    ownerEmail: OWNER_QUAYE.email,
    name: "Tesano Flats",
    street: "4 Tesano Avenue",
    area: "Tesano",
    houseRules:
      "The backyard is for drying clothes, not for storing scrap. Keep the septic lid clear. Tell the office before a long trip so they can watch the unit. No overnight guests beyond two weeks.",
    units: [
      {
        label: "T1",
        kind: "apartment",
        leases: [
          {
            displayName: "Afia Darkoa",
            email: "afia.darkoa@ridgeway.gh",
            startedOn: "2024-03-01",
            rentMajor: 3200,
            dueDay: 5,
          },
        ],
      },
      {
        label: "T2",
        kind: "apartment",
        leases: [
          {
            displayName: "Yaw Boakye",
            email: "yaw.boakye@ridgeway.gh",
            startedOn: "2025-01-01",
            rentMajor: 3100,
            dueDay: 15,
            payer: "late",
          },
        ],
      },
      {
        label: "T3",
        kind: "apartment",
        leases: [
          {
            displayName: "Akosua Paintsil",
            email: "akosua.paintsil@ridgeway.gh",
            startedOn: "2024-09-01",
            rentMajor: 3400,
            dueDay: 1,
          },
        ],
      },
      { label: "T4", kind: "apartment", leases: [] },
    ],
  },
  {
    ownerEmail: OWNER_QUAYE.email,
    name: "Spintex Lock-ups",
    street: "88 Spintex Road",
    area: "Spintex",
    houseRules:
      "Loading happens from the rear lane, not the main road. Each lock-up keeps a fire extinguisher. Do not sleep in the shops overnight. The shared toilet is locked at 8pm.",
    units: [
      {
        label: "L1",
        kind: "commercial",
        leases: [
          {
            displayName: "Ibrahim Sulemana",
            email: "ibrahim.sulemana@ridgeway.gh",
            startedOn: "2024-05-01",
            rentMajor: 8500,
            dueDay: 1,
          },
        ],
      },
      {
        label: "L2",
        kind: "commercial",
        leases: [
          {
            displayName: "Aisha Mohammed",
            email: "aisha.mohammed@ridgeway.gh",
            startedOn: "2024-11-01",
            rentMajor: 9000,
            dueDay: 5,
            payer: "uneven",
          },
        ],
      },
      { label: "L3", kind: "commercial", leases: [] },
    ],
  },
];

export const TICKETS: SeedTicket[] = [
  {
    buildingName: "Ridge Court",
    unitLabel: "B12",
    description: "Kitchen tap drips even when the handle is fully closed.",
    category: "plumbing",
    urgency: "normal",
    status: "received",
  },
  {
    buildingName: "Ridge Court",
    unitLabel: "B12",
    description: "Bedroom air conditioner blows warm air all afternoon.",
    category: "electrical",
    urgency: "high",
    status: "assigned",
    assigneeEmail: YAW,
  },
  {
    buildingName: "Ridge Court",
    unitLabel: "B12",
    description: "Water heater trips the breaker after a few minutes.",
    category: "electrical",
    urgency: "normal",
    status: "scheduled",
    assigneeEmail: YAW,
    scheduledFor: "2026-09-18",
  },
  {
    buildingName: "Ridge Court",
    unitLabel: "B12",
    description: "Cracked balcony tiles were lifting and catching shoes.",
    category: "other",
    urgency: "low",
    status: "done",
    assigneeEmail: YAW,
    scheduledFor: "2026-08-12",
    note: "Replaced the loose tiles and sealed the edge.",
  },
  {
    buildingName: "Ridge Court",
    unitLabel: "B14",
    description: "Toilet will not flush. The cistern fills very slowly.",
    category: "plumbing",
    urgency: "high",
    status: "received",
  },
  {
    buildingName: "Ridge Court",
    unitLabel: "B14",
    description: "Corridor light outside the door flickers after dark.",
    category: "electrical",
    urgency: "low",
    status: "assigned",
    assigneeEmail: YAW,
  },
  {
    buildingName: "Ridge Court",
    unitLabel: "A6",
    description: "Ceiling in the spare room leaks after a heavy rain.",
    category: "plumbing",
    urgency: "high",
    status: "scheduled",
    assigneeEmail: YAW,
    scheduledFor: "2026-09-16",
  },
  {
    buildingName: "Ridge Court",
    unitLabel: "SH1",
    description:
      "Shop shutter jams halfway and has to be lifted by two people.",
    category: "other",
    urgency: "normal",
    status: "received",
  },
  {
    buildingName: "Roman Ridge House",
    unitLabel: "1A",
    description: "Gate motor stopped halfway and would not reverse.",
    category: "electrical",
    urgency: "normal",
    status: "done",
    assigneeEmail: YAW,
    scheduledFor: "2026-07-22",
    note: "Replaced the limit switch.",
  },
  {
    buildingName: "Abelemkpe Courts",
    unitLabel: "A1",
    description: "Kitchen tap spray head split and soaked the cabinet.",
    category: "plumbing",
    urgency: "normal",
    status: "done",
    assigneeEmail: YAW,
    scheduledFor: "2026-06-18",
    note: "Fitted a new spray head.",
  },
  {
    buildingName: "Airport West Residences",
    unitLabel: "3A",
    description:
      "Changeover switch for the generator does not hold on generator.",
    category: "electrical",
    urgency: "high",
    status: "assigned",
    assigneeEmail: ESI,
  },
  {
    buildingName: "East Legon Gardens",
    unitLabel: "G1",
    description: "Pedestrian gate latch sticks and will not lock from inside.",
    category: "other",
    urgency: "low",
    status: "assigned",
    assigneeEmail: ESI,
  },
  {
    buildingName: "Dzorwulu Place",
    unitLabel: "D1",
    description: "Bathroom drain backed up into the shower tray.",
    category: "plumbing",
    urgency: "high",
    status: "done",
    assigneeEmail: ESI,
    scheduledFor: "2026-08-04",
    note: "Cleared the stack and ran water through.",
  },
  {
    buildingName: "Labone Walk-up",
    unitLabel: "C2",
    description: "Kitchen sink backs up when the washing machine drains.",
    category: "plumbing",
    urgency: "normal",
    status: "received",
  },
  {
    buildingName: "Tesano Flats",
    unitLabel: "T1",
    description:
      "Wall socket by the cooker sparks when a kettle is plugged in.",
    category: "electrical",
    urgency: "high",
    status: "scheduled",
    assigneeEmail: ESI,
    scheduledFor: "2026-09-17",
  },
  {
    buildingName: "Osu Oxford House",
    unitLabel: "SH1",
    description: "Air conditioner drain drips onto stock near the counter.",
    category: "plumbing",
    urgency: "normal",
    status: "received",
  },
  {
    buildingName: "Spintex Lock-ups",
    unitLabel: "L1",
    description: "Shop lights went dark on the back wall after a storm.",
    category: "electrical",
    urgency: "normal",
    status: "done",
    assigneeEmail: ESI,
    scheduledFor: "2026-05-20",
    note: "Rewired the back circuit and replaced two fittings.",
  },
  {
    buildingName: "Spintex Lock-ups",
    unitLabel: "L1",
    description: "Roof at the back leaks onto the storage shelves.",
    category: "other",
    urgency: "high",
    status: "assigned",
    assigneeEmail: ESI,
  },
];

export type SeedRentRow = {
  periodLabel: string;
  confirmedStatus: "paid" | "partial" | "unpaid";
  confirmedAmount?: number;
  tenantReported?: boolean;
};

export function monthLabelsInclusive(from: string, to: string): string[] {
  const months: string[] = [];
  let year = Number(from.slice(0, 4));
  let month = Number(from.slice(5, 7));
  const endYear = Number(to.slice(0, 4));
  const endMonth = Number(to.slice(5, 7));
  while (year < endYear || (year === endYear && month <= endMonth)) {
    months.push(`${year}-${String(month).padStart(2, "0")}`);
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }
  return months;
}

export function rentWindowForLease(
  startedOn: string,
  endedOn: string | undefined
): { from: string; to: string } | null {
  const leaseFrom = startedOn.slice(0, 7);
  const from = leaseFrom > SEED_RENT_START ? leaseFrom : SEED_RENT_START;
  const leaseTo = endedOn === undefined ? SEED_RENT_END : endedOn.slice(0, 7);
  const to = leaseTo < SEED_RENT_END ? leaseTo : SEED_RENT_END;
  if (from > to) {
    return null;
  }
  return { from, to };
}

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return Math.abs(hash);
}

export function toSmallestUnit(major: number): number {
  return Math.round(major * 100);
}

export function rentRowsForLease(tenant: SeedTenant): SeedRentRow[] {
  const window = rentWindowForLease(tenant.startedOn, tenant.endedOn);
  if (window === null) {
    return [];
  }
  const amount = toSmallestUnit(tenant.rentMajor);
  const payer = tenant.payer ?? "steady";
  return monthLabelsInclusive(window.from, window.to).map((periodLabel) =>
    rentRowForPeriod(periodLabel, tenant.email, payer, amount)
  );
}

function rentRowForPeriod(
  periodLabel: string,
  email: string,
  payer: SeedPayer,
  amount: number
): SeedRentRow {
  const bucket = hashString(`${periodLabel}:${email}`) % 10;

  if (periodLabel <= "2026-06") {
    if (payer === "late" && periodLabel >= "2026-04") {
      if (periodLabel === "2026-05") {
        return {
          periodLabel,
          confirmedStatus: "partial",
          confirmedAmount: Math.round(amount / 2),
        };
      }
      return { periodLabel, confirmedStatus: "unpaid" };
    }
    if (payer === "uneven" && bucket === 0) {
      return {
        periodLabel,
        confirmedStatus: "partial",
        confirmedAmount: Math.round(amount * 0.6),
      };
    }
    return { periodLabel, confirmedStatus: "paid" };
  }

  if (periodLabel === "2026-07") {
    if (payer === "late") {
      return { periodLabel, confirmedStatus: "unpaid" };
    }
    if (payer === "uneven" && bucket < 3) {
      return {
        periodLabel,
        confirmedStatus: "partial",
        confirmedAmount: Math.round(amount * 0.5),
      };
    }
    return { periodLabel, confirmedStatus: "paid" };
  }

  if (periodLabel === "2026-08") {
    if (payer === "late") {
      return { periodLabel, confirmedStatus: "unpaid", tenantReported: true };
    }
    if (payer === "uneven") {
      return {
        periodLabel,
        confirmedStatus: "partial",
        confirmedAmount: Math.round(amount * 0.4),
      };
    }
    if (bucket === 1) {
      return { periodLabel, confirmedStatus: "unpaid" };
    }
    return { periodLabel, confirmedStatus: "paid" };
  }

  if (payer === "late") {
    return { periodLabel, confirmedStatus: "unpaid" };
  }
  if (payer === "uneven") {
    return { periodLabel, confirmedStatus: "unpaid", tenantReported: true };
  }
  if (bucket < 2) {
    return {
      periodLabel,
      confirmedStatus: "partial",
      confirmedAmount: Math.round(amount * 0.5),
    };
  }
  return { periodLabel, confirmedStatus: "paid" };
}

export function loginEmails(): {
  staff: string[];
  field: string[];
  owners: string[];
  tenants: string[];
} {
  const tenants = new Set<string>();
  for (const building of BUILDINGS) {
    for (const unit of building.units) {
      for (const lease of unit.leases) {
        if (lease.login === true) {
          tenants.add(lease.email);
        }
      }
    }
  }
  return {
    staff: STAFF_PEOPLE.map((row) => row.email),
    field: FIELD_PEOPLE.map((row) => row.email),
    owners: OWNER_PEOPLE.map((row) => row.email),
    tenants: [...tenants],
  };
}

export function ownerCurrency(ownerEmail: string): SeedCurrency {
  const owner = OWNER_PEOPLE.find((row) => row.email === ownerEmail);
  if (owner === undefined) {
    throw new Error(`Unknown owner ${ownerEmail}`);
  }
  return owner.currency;
}
