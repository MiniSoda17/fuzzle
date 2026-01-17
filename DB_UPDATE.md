# Database Update Required

To support the new "Meetup Details" feature (Time, Location, Message), you need to add the following columns to your `meetups` table in Supabase.

Please run the following SQL query in your Supabase SQL Editor:

```sql
ALTER TABLE meetups 
ADD COLUMN meetup_time TEXT,
ADD COLUMN location_name TEXT,
ADD COLUMN message TEXT;
```

This will ensure that the new optional fields are stored correctly when creating a meetup request.
