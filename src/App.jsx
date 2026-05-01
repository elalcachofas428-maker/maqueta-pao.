import React, { useEffect } from 'react'
import './App.css'

function App() {
  useEffect(() => {
    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    const handleScroll = () => {
      if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Hamburger menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const handleHamburgerClick = () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    };
    if (hamburger && navLinks) {
      hamburger.addEventListener('click', handleHamburgerClick);
    }

    const navLinksItems = document.querySelectorAll('#navLinks a');
    navLinksItems.forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });

    // IntersectionObserver for scroll animations
    const revealEls = document.querySelectorAll('.reveal, .stagger');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href.startsWith('#') && href.length > 1) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Parallax blob movement on mouse
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      document.querySelectorAll('.blob').forEach((b, i) => {
        const factor = (i + 1) * 0.4;
        b.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
      });
    };
    document.addEventListener('mousemove', handleMouseMove);

    // Contact form submission
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');

    const handleFormSubmit = (e) => {
      e.preventDefault();
      formMessage.className = 'form-message';
      formMessage.textContent = '';

      submitBtn.classList.add('btn-loading');
      submitBtn.innerHTML = '<span class="spinner"></span>Redirigiendo...';

      const name = document.getElementById('contact-name').value;
      const email = document.getElementById('contact-email').value;
      const phone = document.getElementById('contact-phone').value;
      const audience = document.getElementById('contact-audience').value;
      const message = document.getElementById('contact-message').value;

      const text = `Hola Paola, mi nombre es ${name}.
Email: ${email}
Teléfono: ${phone || 'No provisto'}
Consulta para: ${audience}

Motivo de consulta:
${message}`;

      const whatsappUrl = `https://wa.me/5492324648952?text=${encodeURIComponent(text)}`;
      window.open(whatsappUrl, '_blank');

      submitBtn.classList.remove('btn-loading');
      submitBtn.innerHTML = 'Enviar consulta ✉️';
      formMessage.className = 'form-message success';
      formMessage.textContent = '¡Redirigiendo a WhatsApp! 💜';
      setTimeout(() => { form.reset(); formMessage.className = 'form-message'; }, 3000);
    };

    if (form) {
      form.addEventListener('submit', handleFormSubmit);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (hamburger) hamburger.removeEventListener('click', handleHamburgerClick);
      document.removeEventListener('mousemove', handleMouseMove);
      if (form) form.removeEventListener('submit', handleFormSubmit);
    };
  }, []);

  return (
    <>
      <a href="#main-content" className="skip-link">Ir al contenido principal</a>
      <noscript><div style={{"background":"#FF00CC","color":"white","textAlign":"center","padding":"1rem","fontFamily":"sans-serif"}}>Este sitio funciona mejor con JavaScript habilitado. Por favor, activalo en tu navegador.</div></noscript>

      {/* NAVBAR */}
      <nav id="navbar">
        <div className="nav-logo">Psicopedagogía · PZ</div>
        <ul className="nav-links" id="navLinks">
          <li><a href="#sobre">Sobre mí</a></li>
          <li><a href="#servicios">Servicios</a></li>
          <li><a href="#proceso">Proceso</a></li>
          <li><a href="#materiales">Materiales</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>
        <button className="hamburger" id="hamburger" aria-label="Abrir menú de navegación">
          <span></span><span></span><span></span>
        </button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-blobs">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
        </div>

        <div className="hero-badge">✨ Aprendizaje · Bienestar · Crecimiento</div>

        {/* LOGO PLACEHOLDER (Hasta que se restaure logo.png) */}
        <div className="hero-logo-placeholder">
          <h1>Psicopedagogía</h1>
          <div className="logo-name">Paola Zabala</div>
        </div>
        <p className="hero-tagline">
          Acompañamiento personalizado para potenciar el aprendizaje,
          superar dificultades y descubrir las capacidades únicas de cada persona.
        </p>

        <div className="hero-cta">
          <a href="#contacto" className="btn-primary">Solicitar consulta</a>
          <a href="#servicios" className="btn-secondary">Ver servicios</a>
        </div>

        <div className="scroll-indicator">
          <span>Deslizá</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* PARALLAX STRIP */}
      <div className="parallax-strip">
        <div className="strip-inner">
          <span className="strip-item">Evaluación psicopedagógica <span className="strip-dot"></span></span>
          <span className="strip-item">Dificultades de aprendizaje <span className="strip-dot"></span></span>
          <span className="strip-item">Atención y concentración <span className="strip-dot"></span></span>
          <span className="strip-item">Lectoescritura <span className="strip-dot"></span></span>
          <span className="strip-item">Acompañamiento escolar <span className="strip-dot"></span></span>
          <span className="strip-item">Orientación vocacional <span className="strip-dot"></span></span>
          <span className="strip-item">Evaluación psicopedagógica <span className="strip-dot"></span></span>
          <span className="strip-item">Dificultades de aprendizaje <span className="strip-dot"></span></span>
          <span className="strip-item">Atención y concentración <span className="strip-dot"></span></span>
          <span className="strip-item">Lectoescritura <span className="strip-dot"></span></span>
          <span className="strip-item">Acompañamiento escolar <span className="strip-dot"></span></span>
          <span className="strip-item">Orientación vocacional <span className="strip-dot"></span></span>
        </div>
      </div>

      {/* ABOUT */}
      <main id="main-content" role="main">
        <section className="about" id="sobre">
          <div className="container">
            <div className="about-grid">
              <div className="about-visual reveal scale-in">
                <div className="about-card-big">
                  <span className="about-emoji">📚</span>
                  <p style={{fontFamily:"'Nunito',sans-serif",fontWeight:"800",fontSize:"1.2rem",color:"var(--purple-dark)"}}>Cada mente aprende diferente</p>
                  <p style={{fontSize:"0.85rem",color:"var(--text-mid)",marginTop:"0.5rem",lineHeight:"1.6"}}>y merece un acompañamiento único.</p>
                </div>
                <div className="about-card-stat top-right">
                  <span className="stat-number">+10</span>
                  <span className="stat-label">Años de experiencia</span>
                </div>
                <div className="about-card-stat bottom-left">
                  <span className="stat-number">💜</span>
                  <span className="stat-label">Con amor</span>
                </div>
              </div>

              <div className="reveal from-right">
                <span className="section-label">¿Qué es la psicopedagogía?</span>
                <h2 className="section-title">Aprender es un <span>camino</span>, no una carrera</h2>
                <p className="section-desc">
                  La psicopedagogía estudia cómo aprendemos, detecta dificultades y diseña estrategias 
                  personalizadas para que cada persona alcance su máximo potencial educativo y emocional.
                </p>
                <ul className="about-list">
                  <li><div className="check-icon"></div>Evaluación integral del proceso de aprendizaje</li>
                  <li><div className="check-icon"></div>Detección temprana de dificultades (dislexia, TDAH, etc.)</li>
                  <li><div className="check-icon"></div>Estrategias personalizadas para cada perfil cognitivo</li>
                  <li><div className="check-icon"></div>Trabajo articulado con familia y escuela</li>
                  <li><div className="check-icon"></div>Fortalecimiento de la autoestima y motivación</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="services" id="servicios">
          <div className="container">
            <div className="reveal" style={{textAlign:"center",maxWidth:"600px",margin:"0 auto"}}>
              <span className="section-label">¿Qué ofrezco?</span>
              <h2 className="section-title">Mis <span>servicios</span></h2>
              <p className="section-desc" style={{margin:"0 auto"}}>
                Cada servicio está diseñado para acompañar de manera integral el proceso 
                de aprendizaje, desde la infancia hasta la adultez.
              </p>
            </div>

            <div className="services-grid stagger">
              <div className="service-card">
                <div className="service-icon-wrap icon-purple">📋</div>
                <div className="service-title">Admisión psicopedagógica</div>
                <p className="service-desc">Primera entrevista para conocer el motivo de consulta, evaluar necesidades y planificar el acompañamiento adecuado.</p>
              </div>
              <div className="service-card">
                <div className="service-icon-wrap icon-magenta">🧩</div>
                <div className="service-title">Evaluación y tratamiento psicopedagógico</div>
                <p className="service-desc">Diagnóstico y abordaje de dificultades de aprendizaje con estrategias personalizadas para cada paciente.</p>
              </div>
              <div className="service-card">
                <div className="service-icon-wrap icon-beige">🏫</div>
                <div className="service-title">Orientación a padres y docentes</div>
                <p className="service-desc">Asesoramiento integral y trabajo en equipo con la familia y la escuela para potenciar el desarrollo.</p>
              </div>
              <div className="service-card">
                <div className="service-icon-wrap icon-magenta">🎯</div>
                <div className="service-title">Orientación vocacional y reorientación</div>
                <p className="service-desc">Acompañamiento en la elección de carreras u oficios, descubriendo intereses, habilidades y proyecto de vida.</p>
              </div>
              <div className="service-card">
                <div className="service-icon-wrap icon-purple">📖</div>
                <div className="service-title">Talleres de alfabetización, lectura y escritura</div>
                <p className="service-desc">Espacios lúdicos y dinámicos para fortalecer la lectoescritura y la comprensión desde edades tempranas.</p>
              </div>
              <div className="service-card">
                <div className="service-icon-wrap icon-beige">🧠</div>
                <div className="service-title">Atención y Funciones Ejecutivas</div>
                <p className="service-desc">Trabajo específico en organización, planificación, memoria de trabajo y autorregulación para potenciar el rendimiento académico.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FOR WHOM + PROCESS */}
        <section className="for-whom" id="proceso">
          <div className="container">
            <div className="for-whom-layout">
              <div className="reveal from-left">
                <span className="section-label">¿Para quién?</span>
                <h2 className="section-title">Acompaño a <span>todas</span> las edades</h2>
                <p className="section-desc">Trabajo con niños, adolescentes y adultos que enfrentan desafíos en su proceso de aprendizaje.</p>
                <div className="pills-grid">
                  <div className="pill">🧒 Niños (4-12 años)</div>
                  <div className="pill pill-alt">🧑 Adolescentes</div>
                  <div className="pill">👩 Adultos</div>
                  <div className="pill pill-alt">👨‍👩‍👧 Familias</div>
                  <div className="pill">📚 Estudiantes universitarios</div>
                  <div className="pill pill-alt">🍎 Docentes</div>
                </div>
              </div>

              <div className="reveal from-right">
                <span className="section-label">Cómo trabajo</span>
                <h2 className="section-title">El <span>proceso</span></h2>
                <div className="process-steps">
                  <div className="step">
                    <div className="step-left">
                      <div className="step-num">1</div>
                      <div className="step-line"></div>
                    </div>
                    <div className="step-content">
                      <div className="step-title">Consulta inicial gratuita</div>
                      <div className="step-desc">Conversamos sobre la situación, expectativas y necesidades para ver si podemos trabajar juntos.</div>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-left">
                      <div className="step-num">2</div>
                      <div className="step-line"></div>
                    </div>
                    <div className="step-content">
                      <div className="step-title">Evaluación integral</div>
                      <div className="step-desc">Aplicación de instrumentos de evaluación y análisis del perfil de aprendizaje único de cada persona.</div>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-left">
                      <div className="step-num">3</div>
                      <div className="step-line"></div>
                    </div>
                    <div className="step-content">
                      <div className="step-title">Devolución y plan de trabajo</div>
                      <div className="step-desc">Presentación de resultados y diseño colaborativo de un plan de intervención personalizado.</div>
                    </div>
                  </div>
                  <div className="step">
                    <div className="step-left">
                      <div className="step-num">4</div>
                    </div>
                    <div className="step-content">
                      <div className="step-title">Seguimiento continuo</div>
                      <div className="step-desc">Sesiones de trabajo, ajustes según la evolución y comunicación permanente con familia y escuela.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STORE / MATERIALES */}
        <section className="store" id="materiales">
          <div className="container">
            <div className="reveal" style={{textAlign:"center",maxWidth:"650px",margin:"0 auto"}}>
              <span className="section-label">Recursos descargables</span>
              <h2 className="section-title">Materiales <span>Digitales</span></h2>
              <p className="section-desc" style={{margin:"0 auto"}}>
                Recursos prácticos, lúdicos y listos para usar. Diseñados con amor para acompañar el aprendizaje en casa o en el aula, evitando frustraciones y potenciando logros.
              </p>
            </div>

            <div className="store-grid stagger">
              <div className="product-card">
                <img src="/assets/discalculia.png" alt="Cuadernillo de discalculia" className="product-img" />
                <div className="product-content">
                  <h3 className="product-title">Cuadernillo de discalculia</h3>
                  <div className="product-price">$ 15.000,00 ARS</div>
                  <p className="product-desc">Un material pensado para acompañar a niños y niñas que presentan desafíos con el aprendizaje de las matemáticas. Contiene actividades prácticas, coloridas y progresivas que facilitan la comprensión de números, operaciones y conceptos básicos, de manera clara y divertida.</p>
                  <a href="https://wa.me/5492324648952?text=Hola%20Paola!%20%F0%9F%91%8B%20Estoy%20interesado/a%20en%20adquirir%20el%20material%20digital:%20*Cuadernillo%20de%20Discalculia*.%20%E2%9E%97%20%C2%BFMe%20podr%C3%ADas%20indicar%20c%C3%B3mo%20realizar%20el%20pago?%20Muchas%20gracias!" target="_blank" className="product-btn">Comprar por WhatsApp</a>
                </div>
              </div>

              <div className="product-card">
                <img src="/assets/dislexia.jpg" alt="Dislexia. Actividades divertidas" className="product-img" />
                <div className="product-content">
                  <h3 className="product-title">Dislexia. Actividades divertidas para aprender mejor</h3>
                  <div className="product-price">$ 15.000,00 ARS <span className="product-price-old">$ 18.000,00 ARS</span></div>
                  <p className="product-desc">✨ Cuadernillo de Dislexia – 130 actividades ✨</p>
                  <a href="https://wa.me/5492324648952?text=Hola%20Paola!%20%F0%9F%91%8B%20Estoy%20interesado/a%20en%20adquirir%20el%20material%20digital:%20*Cuadernillo%20de%20Dislexia*.%20%E2%9E%97%20%C2%BFMe%20podr%C3%ADas%20indicar%20c%C3%B3mo%20realizar%20el%20pago?%20Muchas%20gracias!" target="_blank" className="product-btn">Comprar por WhatsApp</a>
                </div>
              </div>

              <div className="product-card">
                <img src="/assets/disortografia.png" alt="Cuadernillo de disortografía" className="product-img" />
                <div className="product-content">
                  <h3 className="product-title">Cuadernillo de disortografía</h3>
                  <div className="product-price">$ 15.000,00 ARS</div>
                  <p className="product-desc">Este material está pensado para acompañar a niños y niñas que presentan errores frecuentes en la escritura, ofreciendo actividades claras, divertidas y progresivas.</p>
                  <a href="https://wa.me/5492324648952?text=Hola%20Paola!%20%F0%9F%91%8B%20Estoy%20interesado/a%20en%20adquirir%20el%20material%20digital:%20*Cuadernillo%20de%20Disortograf%C3%ADa*.%20%E2%9E%97%20%C2%BFMe%20podr%C3%ADas%20indicar%20c%C3%B3mo%20realizar%20el%20pago?%20Muchas%20gracias!" target="_blank" className="product-btn">Comprar por WhatsApp</a>
                </div>
              </div>

              <div className="product-card">
                <img src="/assets/historias.jpg" alt="Historias que calman" className="product-img" />
                <div className="product-content">
                  <h3 className="product-title">Historias que calman</h3>
                  <div className="product-price">$ 10.000,00 ARS</div>
                  <p className="product-desc">✨ NOVEDAD: Historias para la Calma ✨</p>
                  <a href="https://wa.me/5492324648952?text=Hola%20Paola!%20%F0%9F%91%8B%20Estoy%20interesado/a%20en%20adquirir%20el%20material%20digital:%20*Historias%20que%20Calman*.%20%E2%9E%97%20%C2%BFMe%20podr%C3%ADas%20indicar%20c%C3%B3mo%20realizar%20el%20pago?%20Muchas%20gracias!" target="_blank" className="product-btn">Comprar por WhatsApp</a>
                </div>
              </div>

              <div className="product-card">
                <img src="/assets/guia-tea.png" alt="Guía práctica para docentes (TEA)" className="product-img" />

                <div className="product-content">
                  <h3 className="product-title">Guía práctica para docentes (TEA)</h3>
                  <div className="product-price">$ 15.000,00 ARS</div>
                  <p className="product-desc">Guía Resumida para Docentes con Alumnos con TEA.</p>
                  <a href="https://wa.me/5492324648952?text=Hola%20Paola!%20%F0%9F%91%8B%20Estoy%20interesado/a%20en%20adquirir%20el%20material%20digital:%20*Gu%C3%ADa%20Docente%20TEA*.%20%E2%9E%97%20%C2%BFMe%20podr%C3%ADas%20indicar%20c%C3%B3mo%20realizar%20el%20pago?%20Muchas%20gracias!" target="_blank" className="product-btn">Comprar por WhatsApp</a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA BAND */}
        <div className="cta-band reveal">
          <h2>¿Listo para dar el primer paso?</h2>
          <p>La primera consulta es gratuita y sin compromiso. Conversemos sobre cómo puedo ayudarte.</p>
          <a href="#contacto" className="btn-white">Escribime hoy</a>
        </div>

        {/* CONTACT */}
        <section className="contact" id="contacto">
          <div className="container">
            <div className="contact-grid">
              <div className="reveal from-left">
                <span className="section-label">¿Hablamos?</span>
                <h2 className="section-title">Tomá el <span>primer paso</span></h2>
                <p className="section-desc" style={{marginBottom:"2.5rem"}}>
                  Estoy acá para escucharte y acompañarte. Podés contactarme por cualquiera de estos medios o completar el formulario.
                </p>
                <div className="contact-info-item">
                  <div className="contact-icon">📱</div>
                  <div className="contact-info-text">
                    <strong>WhatsApp</strong>
                    <span>Consultas rápidas y turnos</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">📧</div>
                  <div className="contact-info-text">
                    <strong>Email</strong>
                    <span>paolazabalapsp@gmail.com</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-info-text">
                    <strong>Ubicación</strong>
                    <span>Mercedes, Buenos Aires</span>
                  </div>
                </div>
                <div className="contact-info-item">
                  <div className="contact-icon">🕐</div>
                  <div className="contact-info-text">
                    <strong>Horarios (Solo con cita)</strong>
                    <span>Lun, Mar, Mié y Vie</span>
                  </div>
                </div>
              </div>

              <div className="reveal from-right">
                <div className="contact-form">
                  <h3 style={{fontFamily:"'Nunito',sans-serif",fontWeight:"800",fontSize:"1.3rem",color:"var(--text-dark)",marginBottom:"1.5rem"}}>Solicitá tu consulta</h3>
                  <form id="contactForm">
                    <div className="form-group">
                      <label htmlFor="contact-name">Nombre completo</label>
                      <input type="text" id="contact-name" name="name" placeholder="Tu nombre y apellido" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-email">Email</label>
                      <input type="email" id="contact-email" name="email" placeholder="tucorreo@email.com" required />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-phone">Teléfono (opcional)</label>
                      <input type="tel" id="contact-phone" name="phone" placeholder="11 1234-5678" />
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-audience">¿Para quién es la consulta?</label>
                      <select id="contact-audience" name="audience" required>
                        <option value="">Seleccioná una opción</option>
                        <option>Para mi hijo/a (4-12 años)</option>
                        <option>Para un adolescente</option>
                        <option>Para mí (adulto)</option>
                        <option>Asesoramiento docente/familiar</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="contact-message">Motivo de consulta</label>
                      <textarea id="contact-message" name="message" placeholder="Contame brevemente qué está pasando..." required></textarea>
                    </div>
                    <button type="submit" id="submitBtn" className="btn-primary" style={{width:"100%",justifyContent:"center",borderRadius:"14px",padding:"1rem"}}>
                      Enviar consulta ✉️
                    </button>
                    <div id="formMessage" className="form-message"></div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">Psicopedagogía</div>
              <p>Acompañamiento profesional y materiales digitales diseñados para potenciar el aprendizaje y bienestar emocional.</p>
              <div className="footer-socials">
                <a href="https://www.instagram.com/paola_psicope/?hl=es" target="_blank" className="social-link" aria-label="Instagram">
                  <svg style={{width:"20px",height:"20px",fill:"currentColor"}} viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.78-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.78 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.78.058-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Secciones</div>
              <ul className="footer-links">
                <li><a href="#sobre">Sobre mí</a></li>
                <li><a href="#servicios">Servicios</a></li>
                <li><a href="#materiales">Materiales</a></li>
                <li><a href="#contacto">Contacto</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Contacto</div>
              <ul className="footer-links">
                <li><a href="https://wa.me/5492324648952" target="_blank">WhatsApp: +54 9 2324 648952</a></li>
                <li><a href="mailto:paolazabalapsp@gmail.com">paolazabalapsp@gmail.com</a></li>
                <li><a href="#">Mercedes, Buenos Aires</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2025 Paola Zabala · Psicopedagoga</div>
            <div>Todos los derechos reservados</div>
          </div>
        </div>
      </footer>

      {/* WHATSAPP FLOAT */}
      <a href="https://wa.me/5492324648952" target="_blank" rel="noopener" className="whatsapp-float" aria-label="Contactar por WhatsApp">
        <div className="whatsapp-pulse"></div>
        <span className="whatsapp-tooltip">¡Chateá conmigo!</span>
        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5 1.128 6.744 3.046 9.378L1.054 31.29l6.118-1.958A15.9 15.9 0 0016.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.342 22.622c-.39 1.1-1.932 2.014-3.16 2.28-.84.18-1.936.322-5.628-1.21-4.722-1.96-7.76-6.748-7.994-7.062-.226-.314-1.886-2.512-1.886-4.792s1.194-3.402 1.618-3.868c.424-.466.924-.582 1.232-.582.308 0 .616.002.886.016.284.014.666-.108 1.042.794.39.934 1.326 3.232 1.442 3.466.116.234.194.508.038.82-.154.314-.232.508-.464.782-.232.274-.488.612-.698.822-.232.232-.474.484-.204.948.27.466 1.2 1.978 2.578 3.206 1.772 1.578 3.264 2.068 3.73 2.302.466.234.738.194 1.01-.116.272-.314 1.166-1.36 1.476-1.826.31-.466.62-.39 1.044-.234.424.156 2.704 1.276 3.168 1.508.466.232.776.35.892.542.116.194.116 1.1-.274 2.202z"/></svg>
      </a>
    </>
  )
}

export default App
