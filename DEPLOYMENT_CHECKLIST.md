# Deployment Checklist

This app can collect results from deployed worker sessions through Supabase-backed API routes.

## 1. Create Supabase tables

Open the Supabase SQL editor and run:

```sql
-- docs/supabase_schema.sql
```

Use the full SQL in `docs/supabase_schema.sql`.

## 2. Set deployment environment variables

Required:

- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase service role key. Keep this server-only.

Recommended:

- `ADMIN_RESULTS_TOKEN`: token required when reading `/api/results`.
- `UPSTAGE_API_KEY`: needed only for hosted AI message generation.
- `UPSTAGE_MODEL`: optional, defaults to `solar-pro2`.
- `UPSTAGE_API_URL`: optional.

## 3. Verify the flow after deployment

1. Open the deployed requester page.
2. Create or apply a task and generate the worker participation link.
3. Open the worker link in a separate browser or incognito window.
4. Complete several items or close the tab mid-task to create an exit case.
5. Return to the requester page and click refresh in the participation result panel.
6. Download the analytics CSV.

## Notes

- Worker task loading depends on `/api/tasks/:id`, so Supabase must be configured before sharing links with real participants.
- Worker result submission uses `/api/results` POST and stays open so participants can submit.
- Result reading uses `/api/results` GET. If `ADMIN_RESULTS_TOKEN` is set, the requester must enter that token once in the browser.
- Local `server.js` stores data in `data/*.json`; deployed serverless routes store data in Supabase.
- Each participant is automatically assigned a browser-level `participantId` and that ID is stored with every session.
- If you want controlled cohorts, you can append `participantId` or `participantGroup` to the worker URL, for example `#worker?taskId=...&participantGroup=A`.
