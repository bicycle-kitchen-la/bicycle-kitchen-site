import { z } from 'astro/zod';
import { parse } from 'yaml';
import coOpsFile from '../content/co-ops.yml?raw';
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

// Reads a YouTube link and returns the video's ID, or nothing if it isn't one.
// Works with youtube.com/shorts/…, youtube.com/watch?v=…, and youtu.be/… links.
export function youtubeVideo(link: string) {
  let url: URL;
  try {
    url = new URL(link.trim());
  } catch {
    return undefined;
  }
  const host = url.hostname.replace(/^(www|m)\./, '');
  let id: string | null | undefined;
  if (host === 'youtu.be') id = url.pathname.split('/')[1];
  else if (host === 'youtube.com') {
    const [, kind, value] = url.pathname.split('/');
    id = kind === 'watch' ? url.searchParams.get('v') : ['shorts', 'embed', 'live'].includes(kind) ? value : undefined;
  }
  if (!id || !/^[\w-]{11}$/.test(id)) return undefined;
  // Shorts are tall; other videos are wide.
  return { id, tall: url.pathname.startsWith('/shorts/'), link: link.trim() };
}

export const photos = read(
  'photos.yml',
  photosFile,
  z.record(
    z.string(),
    z
      .object({
        image: z.string().nullish(),
        alt: z.string().nullish(),
        video: z.string().nullish(),
      })
      .refine((photo) => !photo.image || photo.alt?.trim(), {
        message: 'Every photo needs alt text. Add a short description of the photo.',
      })
      .refine((photo) => !photo.video?.trim() || youtubeVideo(photo.video), {
        message: 'The video link must be a YouTube link, like https://www.youtube.com/shorts/MuEHU2bRazA. Or clear it to show the photo instead.',
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

export const coOpsPage = read(
  'co-ops.yml',
  coOpsFile,
  z.object({
    search_description: z.string().min(1),
    lead: z.string().min(1),
    intro: z.string().min(1),
    map_labels: z.object({
      bikerowave: z.string().min(1),
      kitchen: z.string().min(1),
      bike_oven: z.string().min(1),
    }),
    map_description: z.string().min(1),
    map_caption: z.string().min(1),
    tips_heading: z.string().min(1),
    tips: optionalList(z.object({ question: z.string().min(1), answer: z.string().min(1) })),
    tips_note: z.string().nullish(),
    co_ops: optionalList(
      z.object({
        name: z.string().min(1),
        where: z.string().min(1),
        lead: z.string().min(1),
        about: z.string().min(1),
        website_label: z.string().min(1),
        website_url: z.url(),
        hours: optionalList(z.object({ days: z.string().min(1), time: z.string().min(1) })),
        address: z.string().min(1),
        phone: z.string().nullish(),
        email: z.string().nullish(),
        instagram: z.string().nullish(),
      }),
    ),
  }),
);

// "(323) 662-2776" becomes "tel:+13236622776"
export const telHref = (phone: string) => `tel:+1${phone.replace(/\D/g, '')}`;
export const phoneHref = telHref(settings.phone);
