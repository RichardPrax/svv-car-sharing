-- SQL-Skript zum Erstellen der user_profiles Tabelle
-- Diese Tabelle erweitert die Supabase auth.users Tabelle um Vor- und Nachname

CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) aktivieren
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Policies erstellen
-- Benutzer können ihr eigenes Profil lesen
CREATE POLICY "Users can read own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- Benutzer können ihr eigenes Profil aktualisieren
CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Alle können Profile lesen (für Namen in Fahrten)
CREATE POLICY "All can read profiles" ON public.user_profiles
    FOR SELECT USING (true);

-- Function zur automatischen Erstellung eines user_profiles Eintrags bei Registrierung
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, first_name, last_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'last_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger erstellen, der bei neuen Benutzern ausgelöst wird
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Index für bessere Performance
CREATE INDEX idx_user_profiles_names ON public.user_profiles(first_name, last_name);
