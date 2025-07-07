// src/components/layout/Header.tsx
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/router';

const Header = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await supabase.auth.signOut();
            router.push('/login');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <header style={{
            background: 'var(--background)',
            borderBottom: '1px solid var(--border)',
            padding: 'var(--spacing-md)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <h1 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: 'var(--text-primary)',
                    margin: 0,
                }}>
                    SVV Car Sharing
                </h1>

                <button
                    onClick={handleLogout}
                    disabled={loading}
                    style={{
                        background: 'var(--accent)',
                        color: 'white',
                        border: 'none',
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        borderRadius: 'var(--radius)',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        opacity: loading ? 0.7 : 1,
                    }}
                >
                    {loading ? 'Abmelden...' : 'Abmelden'}
                </button>
            </div>
        </header>
    );
};

export default Header;
