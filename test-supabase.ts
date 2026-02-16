
import { supabase } from './src/supabase.ts';

async function testConnection() {
    try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1);
        if (error) {
            console.error('Connection failed:', error.message);
        } else {
            console.log('Connection successful! Data:', data);
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

testConnection();
