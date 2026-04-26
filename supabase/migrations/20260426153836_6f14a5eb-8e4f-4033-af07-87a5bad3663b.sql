
CREATE TABLE public.evidence (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  confidence NUMERIC NOT NULL,
  explanation TEXT,
  suggestion TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.evidence ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (anon-friendly demo)
CREATE POLICY "Anyone can insert evidence"
  ON public.evidence FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow read of all evidence (demo); UI filters by session_id
CREATE POLICY "Anyone can read evidence"
  ON public.evidence FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE INDEX evidence_session_id_idx ON public.evidence(session_id);
CREATE INDEX evidence_created_at_idx ON public.evidence(created_at DESC);
