# Firestore structure

This project uses Firestore as a server-owned datastore. The Next.js API routes
read and write through `firebase-admin`, so Firestore Security Rules are only a
client-side backstop.

## Collections

### `riders`

Document id: the rider slug already used in the app.

Example:

```json
{
  "id": "andrea",
  "name": "Andrea Del Bianco",
  "color": "#6366f1"
}
```

Fields:

- `id`: string, same as the document id
- `name`: string
- `color`: string, hex color

### `availability`

Document id: `${rider_id}_${date}` or the current app key `${rider_id}:${date}`.

Example:

```json
{
  "id": "andrea:2026-07-06",
  "rider_id": "andrea",
  "date": "2026-07-06",
  "month": "2026-07",
  "status": "available"
}
```

Fields:

- `id`: string
- `rider_id`: string, references `riders.id`
- `date`: string in `yyyy-MM-dd`
- `month`: string in `yyyy-MM`
- `status`: one of `available`, `unsure`, `unavailable`

## Query pattern

The app reads monthly availability with:

- `availability.where("month", "==", "yyyy-MM")`

That is why the `month` field is stored explicitly.

## Indexes

- No custom composite index is needed for the current queries.
- Firestore creates single-field indexes automatically.

## Seed behavior

- If the `riders` collection is empty, the server seeds it from `lib/riders.ts`.
- Availability records are written lazily when a user updates a day.

## Rules strategy

The repository ships with a deny-all client ruleset in `firestore.rules`.
That is intentional because the app uses the Admin SDK on the server.

If you later want direct client access through the Firebase Web SDK, the rules
should be updated to match your auth model.
