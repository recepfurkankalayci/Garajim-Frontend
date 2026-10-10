import { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isRegistering) {
        await axios.post('http://localhost:3000/auth/register', {
          name,
          email,
          password
        });
        alert('Kaydınız başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.');
        setIsRegistering(false);
        setName('');
        setPassword('');
      } else {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email,
          password
        });
        console.log('Giriş başarılı:', response.data);
        localStorage.setItem('token', response.data.token);
        alert('Başarıyla giriş yapıldı!');
        window.location.assign('/home');
      }
    } catch (error) {
      const message = error.response?.data?.message
        || error.response?.data?.error
        || error.message;
      console.error(isRegistering ? 'Kayıt hatası:' : 'Giriş hatası:', message);
      alert(isRegistering
        ? `Kayıt başarısız oldu: ${message}`
        : `Giriş başarısız oldu: ${message}`);
    }
  };

  return (
    <main className="login-page">
      <section className="login-card" aria-label="Garajım giriş">
        <div className="login-brand-panel">
          <div className="login-brand">
            <span className="login-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M8 27.5h32l-3.2-9.2a4 4 0 0 0-3.8-2.7H15a4 4 0 0 0-3.8 2.7L8 27.5Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <path d="M6.5 27.5h35v9h-35v-9Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                <circle cx="14" cy="36.5" r="3.5" fill="currentColor" />
                <circle cx="34" cy="36.5" r="3.5" fill="currentColor" />
                <path d="M15 23h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </span>
            <span>GARAJIM</span>
          </div>

          <div className="login-brand-copy">
            <span className="login-eyebrow">ARACINIZ İÇİN HER ŞEY</span>
            <h1>Yolculuğunuz<br />buradan başlar.</h1>
            <p>Aracınızın bakımını, servis işlemlerini ve ihtiyaçlarını tek bir yerden kolayca yönetin.</p>
          </div>
          <span className="login-panel-decoration" aria-hidden="true">G</span>
          <div className="login-brand-footer">
            <span className="login-status-dot" />
            <span>Aracınız emin ellerde</span>
          </div>
        </div>

        <div className="login-form-panel">
          <div className="login-form-content">
            <span className="login-form-eyebrow">
              {isRegistering ? 'GARAJIM’A KATILIN' : 'HESABINIZA ERİŞİN'}
            </span>
            <h2>{isRegistering ? 'Hesabınızı oluşturun' : 'Tekrar hoş geldiniz'}</h2>
            <p className="login-form-description">
              {isRegistering
                ? 'Garajım’a katılmak için bilgilerinizi girin.'
                : 'Devam etmek için giriş bilgilerinizi girin.'}
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              {isRegistering && (
                <div className="login-field">
                  <label htmlFor="login-name">Ad soyad</label>
                  <input
                    id="login-name"
                    type="text"
                    placeholder="Adınız ve soyadınız"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              <div className="login-field">
                <label htmlFor="login-email">E-posta adresi</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="ornek@email.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-field">
                <label htmlFor="login-password">Şifre</label>
                <input
                  id="login-password"
                  type="password"
                  placeholder="Şifrenizi girin"
                  autoComplete={isRegistering ? 'new-password' : 'current-password'}
                  minLength={isRegistering ? 8 : undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button className="login-submit" type="submit">
                <span>{isRegistering ? 'Kayıt Ol' : 'Giriş Yap'}</span>
                <span className="login-submit-arrow" aria-hidden="true">→</span>
              </button>
            </form>
            <p className="login-mode-toggle">
              {isRegistering ? 'Zaten hesabınız var mı?' : 'Henüz hesabınız yok mu?'}
              <button
                type="button"
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? 'Giriş Yap' : 'Kayıt Ol'}
              </button>
            </p>
            <p className="login-security-note">
              <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M10 2.5 4 5v4.4c0 4 2.5 6.8 6 8.1 3.5-1.3 6-4.1 6-8.1V5l-6-2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                <path d="m7.5 9.8 1.7 1.7 3.5-3.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Bilgileriniz güvenli bağlantıyla korunur.
            </p>
          </div>
          <span className="login-copyright">© 2026 Garajım · Tüm hakları saklıdır</span>
        </div>
      </section>
    </main>
  );
}

export default Login;