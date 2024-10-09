
begin;

-- remove the supabase_realtime publication
drop publication if exists supabase_realtime;

-- re-create the supabase_realtime publication with no tables
create publication supabase_realtime;


-- add table 'User' to the publication
alter publication supabase_realtime add table "User";

-- enable RLS on the table
alter table "User" enable row level security;

grant all on table "User" to service_role;

-- add table 'Post' to the publication
alter publication supabase_realtime add table "Post";

-- enable RLS on the table
alter table "Post" enable row level security;

grant all on table "Post" to service_role;

commit;
