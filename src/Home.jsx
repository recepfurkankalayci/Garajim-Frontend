import { lazy, Suspense, useRef, useState } from 'react';
import './Home.css';
import { garageVehicles } from './data/vehicles';

const VehicleModelViewer = lazy(() => import('./VehicleModelViewer'));

const navigationItems = [
  { id: 'overview', label: 'Genel Bakış', icon: 'grid', href: '#overview' },
  { id: 'my-car', label: 'Aracım', icon: 'car', href: '#my-car' },
  { id: 'maintenance', label: 'Bakım Kayıtları', icon: 'tool', href: '#maintenance' },
  { id: 'appointments', label: 'Randevular', icon: 'calendar', href: '#appointments' },
];

function NavigationIcon({ name }) {
  const paths = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
    car: <><path d="m5 11 1.6-4.1A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.4L19 11" /><path d="M4 11h16v6H4z" /><path d="M7 17v2m10-2v2" /><circle cx="7.5" cy="14" r=".8" /><circle cx="16.5" cy="14" r=".8" /></>,
    tool: <><path d="M14.7 6.3a5 5 0 0 0-6.4 6.4L3.5 17.5a2.1 2.1 0 0 0 3 3l4.8-4.8a5 5 0 0 0 6.4-6.4l-3 3-3.5-3.5 3.5-3.5Z" /></>,
    calendar: <><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M7.5 3.5v3m8-3v3M3.5 9h17m-12 4h2m3 0h2m-7 3h2" /></>,
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Home() {
  const [activeSection, setActiveSection] = useState('overview');
  const [rotation, setRotation] = useState(0);
  const dragRef = useRef(null);
  const activeVehicle = garageVehicles[0];

  const handlePointerDown = (event) => {
    dragRef.current = { pointerId: event.pointerId, clientX: event.clientX };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    const delta = event.clientX - dragRef.current.clientX;
    dragRef.current.clientX = event.clientX;
    setRotation((current) => (current + delta * 0.8 + 360) % 360);
  };

  const stopDragging = () => {
    dragRef.current = null;
  };

  const rotateWithKeyboard = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    setRotation((current) => (current + (event.key === 'ArrowRight' ? 15 : -15) + 360) % 360);
  };

  return (
    <main className="home-shell">
      <aside className="home-sidebar">
        <a className="home-brand" href="/home" aria-label="Garajım ana sayfa">
          <span className="home-brand-mark" aria-hidden="true">
            <NavigationIcon name="car" />
          </span>
          <span>GARAJ<span>IM</span></span>
        </a>

        <div className="home-nav-caption">MENÜ</div>
        <nav className="home-navigation" aria-label="Ana gezinme">
          {navigationItems.map((item) => (
            <a
              className={`home-nav-link${activeSection === item.id ? ' is-active' : ''}`}
              href={item.href}
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              aria-current={activeSection === item.id ? 'page' : undefined}
            >
              <NavigationIcon name={item.icon} />
              <span>{item.label}</span>
              {item.id === 'appointments' && <span className="home-nav-count">2</span>}
            </a>
          ))}
        </nav>

        <div className="home-sidebar-bottom">
          <div className="home-help-card">
            <span className="home-help-icon" aria-hidden="true">?</span>
            <strong>Yardıma mı ihtiyacınız var?</strong>
            <span>Size yardımcı olmak için buradayız.</span>
            <a href="mailto:destek@garajim.com">Destek ekibine ulaşın <span aria-hidden="true">↗</span></a>
          </div>
          <a className="home-logout" href="/" onClick={() => localStorage.removeItem('token')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
            </svg>
            <span>Çıkış Yap</span>
          </a>
          <span className="home-version">GARAJIM · 1.0.0</span>
        </div>
      </aside>

      <section className="home-content" id="overview">
        <header className="home-topbar">
          <div className="home-breadcrumb">
            <span>Garajım</span><span className="home-breadcrumb-divider">/</span><strong>Genel Bakış</strong>
          </div>
          <div className="home-account">
            <button type="button" className="home-notification" aria-label="Bildirimler">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" />
              </svg>
              <i />
            </button>
            <span className="home-account-divider" />
            <span className="home-avatar" aria-hidden="true">M</span>
            <span className="home-account-name">Merhaba, sürücü</span>
          </div>
        </header>

        <div className="home-dashboard">
          <div className="home-heading">
            <div>
              <span className="home-eyebrow">GARAJINIZIN KONTROLÜ SİZDE</span>
              <h1>Aracınıza yakından bakın.</h1>
              <p>Aracınızı inceleyin, bakım ve yol planınızı kolayca yönetin.</p>
            </div>
            <div className="home-date">
              <span className="home-date-dot" />
              <span>Her şey yolunda</span>
            </div>
          </div>

          <section className="home-car-panel" id="my-car" aria-labelledby="home-car-heading">
            <div className="home-car-panel-header">
              <div>
                <span className="home-panel-eyebrow">GARAJIMDAKİ ARAÇ</span>
                <h2 id="home-car-heading">{activeVehicle.brand} {activeVehicle.model}</h2>
                <p>{activeVehicle.year} <span>·</span> {activeVehicle.bodyType} <span>·</span> {activeVehicle.fuelType}</p>
              </div>
              <button className="home-more-button" type="button" aria-label="Araç seçenekleri">•••</button>
            </div>

            <div
              className="home-car-stage"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerCancel={stopDragging}
              onLostPointerCapture={stopDragging}
              onKeyDown={rotateWithKeyboard}
              role="slider"
              aria-label="Aracı döndür"
              aria-valuemin={0}
              aria-valuemax={359}
              aria-valuenow={Math.round(rotation)}
              aria-valuetext={`Araç açısı ${Math.round(rotation)} derece`}
              tabIndex={0}
            >
              <div className="home-stage-grid" aria-hidden="true" />
              <span className="home-stage-orbit home-stage-orbit-one" aria-hidden="true" />
              <span className="home-stage-orbit home-stage-orbit-two" aria-hidden="true" />
              <Suspense fallback={<span className="home-model-status" role="status">3B görüntüleyici hazırlanıyor…</span>}>
                <VehicleModelViewer
                  key={activeVehicle.id}
                  modelUrl={activeVehicle.model3d.src}
                  modelName={`${activeVehicle.brand} ${activeVehicle.model}`}
                  rotation={rotation}
                />
              </Suspense>
              <div className="home-stage-caption">
                <span className="home-drag-indicator" aria-hidden="true">↔</span>
                <span>Aracı döndürmek için sürükleyin</span>
              </div>
              <span className="home-angle">{Math.round(rotation).toString().padStart(3, '0')}°</span>
            </div>

            <div className="home-car-panel-footer">
              <div className="home-plate">
                <span className="home-plate-flag" aria-hidden="true">TR</span>
                <span>{activeVehicle.licensePlate}</span>
              </div>
              <div className="home-rotation-controls" aria-label="Araç döndürme kontrolleri">
                <button type="button" onClick={() => setRotation((current) => (current - 30 + 360) % 360)} aria-label="Aracı sola döndür">←</button>
                <span>360° görünüm</span>
                <button type="button" onClick={() => setRotation((current) => (current + 30) % 360)} aria-label="Aracı sağa döndür">→</button>
              </div>
              <span className="home-car-condition"><i /> Durum: {activeVehicle.condition}</span>
            </div>
            <div className="home-model-credit">
              3B model: <a href={activeVehicle.model3d.sourceUrl} target="_blank" rel="noreferrer">{activeVehicle.model3d.displayName} · {activeVehicle.model3d.author} · {activeVehicle.model3d.license}</a>
            </div>
          </section>

          <div className="home-info-grid">
            <section className="home-info-card" id="maintenance">
              <div className="home-info-icon home-info-icon-red" aria-hidden="true">
                <NavigationIcon name="tool" />
              </div>
              <div className="home-info-copy">
                <span>SONRAKİ BAKIM</span>
                <strong>{activeVehicle.nextMaintenanceKm.toLocaleString('tr-TR')} km sonra</strong>
                <small>Periyodik bakım · 15.000 km</small>
              </div>
              <span className="home-info-arrow" aria-hidden="true">↗</span>
            </section>
            <section className="home-info-card" id="appointments">
              <div className="home-info-icon home-info-icon-amber" aria-hidden="true">
                <NavigationIcon name="calendar" />
              </div>
              <div className="home-info-copy">
                <span>YAKLAŞAN RANDEVU</span>
                <strong>Henüz randevunuz yok</strong>
                <small>Bakım zamanınızı planlayın</small>
              </div>
              <span className="home-info-arrow" aria-hidden="true">↗</span>
            </section>
          </div>
          <footer className="home-footer">© 2026 Garajım <span>·</span> Aracınız emin ellerde.</footer>
        </div>
      </section>
    </main>
  );
}

export default Home;
