// script.js içeriği

const SB_URL = "https://byaljporbguxozbjzcwt.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5YWxqcG9yYmd1eG96Ymp6Y3d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODQ0NDIsImV4cCI6MjA4ODk2MDQ0Mn0.Zxueu5kzUA_kUTnABChDFsvK5gSAorP2rqUAqR3prZQ";
const supabaseClient = supabase.createClient(SB_URL, SB_KEY);

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const msg = document.getElementById('status-msg');
    msg.innerHTML = "İşlem yapılıyor...";
    msg.style.color = "#38bdf8";

    // Form verilerini al
    const firstName = document.getElementById('reg-name').value;
    const lastName = document.getElementById('reg-surname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const typeId = document.getElementById('reg-type').value;

    // 1. Adım: Users tablosuna kayıt
    const { data: user, error: userErr } = await supabaseClient
        .from('users')
        .insert([
            { first_name: firstName, last_name: lastName, email: email, password: password }
        ])
        .select();

    if (userErr) {
        msg.innerHTML = "Hata: " + userErr.message;
        msg.style.color = "#ef4444";
        return;
    }

    // 2. Adım: Musteriler tablosuna kayıt (İlişkisel SQL yapın için)
    const { error: musteriErr } = await supabaseClient
        .from('musteriler')
        .insert([
            { ad: firstName, soyad: lastName, tur_id: typeId }
        ]);

    if (musteriErr) {
        msg.innerHTML = "Kullanıcı oluştu ama müşteri tablosuna yazılamadı: " + musteriErr.message;
        msg.style.color = "#fbbf24";
    } else {
        msg.innerHTML = "Tebrikler! ErenBank hesabı başarıyla oluşturuldu.";
        msg.style.color = "#22c55e";
        e.target.reset(); // Formu temizle
    }
});