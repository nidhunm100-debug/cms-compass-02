# Verify the Deployment End-to-End

## Goal

Confirm that the Limra Academy deployment serves the public website, CMS-driven content, authentication-protected admin panel, and image upload flow without broken routes, missing data, or browser errors.

## Verification Scope

1. **Deployment URL**
   - Use the supplied Vercel/public deployment URL.
   - The project currently has no Lovable-published URL, so the private preview URL will be used only as a fallback comparison if no deployment URL is available.

2. **Public site checks**
   - Open and verify these routes:
     - `/`
     - `/about`
     - `/who-we-serve`
     - `/training-areas`
     - `/programs`
     - `/trainers`
     - `/institutions`
     - `/impact`
     - `/global-reach`
     - `/gallery`
     - `/workshops`
     - `/contact`
   - Confirm each route returns HTTP 200 and does not show the root 404 component.
   - Confirm CMS data renders: homepage sections, programs, people/trainers, institutions, impact statistics, topics, gallery images, workshops, navigation, and footer settings.
   - Inspect console logs, runtime errors, and failed network requests.

3. **Image rendering checks**
   - Verify that database and storage-backed images load on the homepage, program pages, trainer pages, institution pages, and gallery.
   - Detect broken image URLs, expired signed URLs, CORS issues, and blocked storage requests.
   - Confirm each displayed image has useful alt text where the CMS provides it.

4. **Admin panel checks**
   - Open `/admin` and confirm unauthenticated visitors are shown the login flow rather than protected content.
   - If an authenticated browser session is available, verify the dashboard and core CMS modules load:
     - Homepage sections
     - Media library
     - People / Trainers
     - Programs
     - Training topics
     - Institutions
     - Countries
     - Gallery
     - Testimonials
     - Workshops
     - Impact statistics
     - Enquiries
     - Navigation
     - SEO
     - Settings

5. **Image upload test**
   - From the admin media library or image picker, upload a small generated test image using the existing upload flow.
   - Verify the file is stored in the media bucket, registered in `media_assets`, assigned a usable signed URL, and renders in the media library.
   - Delete the test image afterward and confirm both storage and database cleanup complete.
   - If no admin session is available, report this as blocked instead of inventing or exposing credentials.

6. **Fix-and-retest loop**
   - Fix any verified failure in the smallest appropriate layer: route, CMS query, RLS policy, storage policy, signed URL handling, environment variable usage, or image component.
   - Retest every affected route and rerun the image upload flow after fixes.
   - Check the build/error logs before declaring verification complete.

## Expected Result

A concise verification report covering each public route, CMS content rendering, image loading, admin access, upload/delete behavior, console/network errors, and any fixes applied. If the Vercel deployment fails because required environment variables or runtime settings are missing, the report will identify the exact deployment setting that must be corrected.

## Technical Notes

- Use direct HTTP checks for status codes and Playwright for rendered pages, console errors, network failures, and image upload interaction.
- Do not expose or log authentication tokens, service keys, cookies, or environment secrets.
- Public verification does not require admin credentials; upload verification requires an authenticated admin-capable session.
- The public deployment must have the same `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, and related environment variables as the working preview.
