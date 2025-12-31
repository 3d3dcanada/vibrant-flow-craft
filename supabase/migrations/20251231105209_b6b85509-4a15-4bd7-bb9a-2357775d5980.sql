-- Remove existing INSERT policies that allow client-side writes with points
DROP POLICY IF EXISTS "Users can create recycling drops" ON public.recycling_drops;
DROP POLICY IF EXISTS "Users can create shares" ON public.social_shares;

-- Create new restrictive policies
-- Users can ONLY view their own data, not insert directly
-- All inserts must go through edge functions using service role

-- Note: Edge functions use service role which bypasses RLS
-- This effectively prevents any client-side points manipulation

-- If we need users to see their data, the SELECT policies remain
-- The removed INSERT policies mean users cannot insert directly

-- For recycling_drops - users can only view, not insert
-- (edge function with service role handles inserts)

-- For social_shares - users can only view, not insert  
-- (edge function with service role handles inserts)