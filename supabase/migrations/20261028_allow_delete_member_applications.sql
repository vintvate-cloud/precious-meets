-- Migration: Allow deletion of member applications from Admin Console
-- Enables permanent purging of rejected or deleted applicant files and queues.

DROP POLICY IF EXISTS "Allow delete member application" ON public.member_applications;
CREATE POLICY "Allow delete member application" 
ON public.member_applications FOR DELETE 
TO public 
USING (true);

COMMENT ON POLICY "Allow delete member application" ON public.member_applications IS 'Allows admin operations to permanently remove member application records.';
