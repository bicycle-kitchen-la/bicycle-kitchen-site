import { z } from 'astro/zod';
import { parse } from 'yaml';
import hoursFile from '../content/hours.yml?raw';
import photosFile from '../content/photos.yml?raw';
import settingsFile from '../content/settings.yml?raw';
import supportersFile from '../content/supporters.yml?raw';

// Reads the editable files in src/content/ and checks them on every build. If
// an edit breaks a rule, the build stops with an error and the live site stays
// as it was.

function read<T>(fileName: string, text: string, rules: z.ZodType<T>): T {
  let data: unknown;
  try {
    data = parse(text);
  } catch (error) {
    throw new Error(`src/content/${fileName} has a formatting mistake: ${error}`);
  }
  const result = rules.safeParse(data);
  if (!result.success) {
    const problems = result.error.issues.map((issue) => `${issue.path.join(' > ')}: ${issue.message}`);
    throw new Error(`src/content/${fileName} needs fixing. ${problems.join('; ')}`);
  }
  return result.data;
}

// A list a volunteer has emptied may be saved as blank or left out entirely.
const optionalList = <T extends z.ZodType>(item: T) =>
  z.array(item).nullish().transform((list) => list ?? []);

export const settings = read(
  'settings.yml',
  settingsFile,
  z.object({
    alert_on: z.boolean(),
    alert_message: z.string().nullish(),
    phone: z.string().min(1),
    email: z.email(),
    address_line_1: z.string().min(1),
    address_line_2: z.string().min(1),
    directions_url: z.url(),
    instagram_url: z.url(),
    instagram_handle: z.string().min(1),
    paypal_url: z.url(),
    venmo_url: z.url(),
    zeffy_url: z.url(),
  }).refine((site) => !site.alert_on || site.alert_message?.trim(), {
    message: 'The alert banner is on, so it needs a message.',
    path: ['alert_message'],
  }),
);

export const hours = read(
  'hours.yml',
  hoursFile,
  z.object({
    days: z.array(
      z.object({
        day: z.string().min(1),
        time: z.string().min(1),
        note: z.string().nullish(),
      }),
    ),
  }),
);

export const photos = read(
  'photos.yml',
  photosFile,
  z.record(
    z.string(),
    z
      .object({
        image: z.string().nullish(),
        alt: z.string().nullish(),
      })
      .refine((photo) => !photo.image || photo.alt?.trim(), {
        message: 'Every photo needs alt text. Add a short description of the photo.',
      })
      .nullish(),
  ),
);

export const supporters = read(
  'supporters.yml',
  supportersFile,
  z.object({
    neighborhood_councils: optionalList(z.object({ name: z.string().min(1) })),
    individuals: optionalList(
      z.object({
        name: z.string().min(1),
        location: z.string().nullish(),
        thanks: z.string().min(1),
      }),
    ),
    grants: optionalList(
      z.object({
        name: z.string().min(1),
        description: z.string().min(1),
      }),
    ),
  }),
);

// "(323) 662-2776" becomes "tel:+13236622776"
export const phoneHref = `tel:+1${settings.phone.replace(/\D/g, '')}`;
