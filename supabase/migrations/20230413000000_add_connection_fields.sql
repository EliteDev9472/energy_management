
-- Add missing columns to the connections table if they don't exist already
DO $$
BEGIN
    -- Add capacity column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'connections' AND column_name = 'capacity') THEN
        ALTER TABLE public.connections ADD COLUMN capacity TEXT;
    END IF;

    -- Add grid_operator_work_number column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'connections' AND column_name = 'grid_operator_work_number') THEN
        ALTER TABLE public.connections ADD COLUMN grid_operator_work_number TEXT;
    END IF;

    -- Add connection_address column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'connections' AND column_name = 'connection_address') THEN
        ALTER TABLE public.connections ADD COLUMN connection_address TEXT;
    END IF;

    -- Add grid_operator_contact column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'connections' AND column_name = 'grid_operator_contact') THEN
        ALTER TABLE public.connections ADD COLUMN grid_operator_contact TEXT;
    END IF;

    -- Add planned_connection_date column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'connections' AND column_name = 'planned_connection_date') THEN
        ALTER TABLE public.connections ADD COLUMN planned_connection_date TEXT;
    END IF;
END
$$;
