## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site defaults to Russian; use RU/EN in the header. The selection is saved in this browser.

## Mobile app and PWA

On screens narrower than the desktop navigation, use the fixed bottom bar to switch between Home, Projects, Services, About, and Contact. The calculator is linked from Services. The screen content scrolls independently while the app navigation stays in place.

On a supported mobile browser, use the install button in the header. Android opens the browser's native install prompt; iPhone and iPad show the Safari **Share → Add to Home Screen** steps. Installation is available over HTTPS (and on `localhost` during development). The service worker keeps the offline page, app icons, logo, and previously loaded Next.js static assets available; it does not cache API responses or admin pages.

## Supabase and admin access

1. Create a Supabase project.
2. Run [`supabase/migrations/001_initial_schema.sql`](./supabase/migrations/001_initial_schema.sql) in the Supabase SQL Editor.
3. Create the first user in **Supabase Dashboard → Authentication → Users**. There is no public admin sign-up page.
4. Copy the user's UUID and add that user to `public.admin_users` in the SQL Editor:

   ```sql
   insert into public.admin_users (user_id)
   values ('AUTH_USER_UUID');
   ```

5. Copy `.env.example` to `.env.local` and set the project URL and anon/publishable key:

   ```env
   SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   SUPABASE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY
   ```

   Set the same values as server-side environment variables in production, then restart/redeploy.

Sign in at [`/admin/login`](http://localhost:3000/admin/login). Admin pages and APIs verify both the Supabase Auth session and the user's `admin_users` role. The app does not use or require a Service Role key. Project images are stored in the `project-images` Supabase Storage bucket created by the migration.

Without these Supabase settings, the admin displays setup instructions and cannot sign in. The public inquiry form uses the local JSON fallback in development; persistent inquiry and admin data require a configured Supabase project.
