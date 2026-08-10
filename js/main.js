document.addEventListener('DOMContentLoaded', () => {
    // --- 1. ENRUTADOR DINÁMICO MULTIVISTA SPA (Home, Acerca de Nosotros, Contacto) ---
    const mainContent = document.getElementById('main-content');
    const acercaDeSection = document.getElementById('acerca-de');
    const contactoPageSection = document.getElementById('contacto-page');
    const terminosSection = document.getElementById('terminos');
    const customLinks = document.querySelectorAll('.nav-link-custom');

    function handleNavigation(targetHash) {
        // Ocultar todas las vistas principales
        mainContent.classList.add('d-none');
        acercaDeSection.classList.add('d-none');
        contactoPageSection.classList.add('d-none');
        if (terminosSection) {
            terminosSection.classList.add('d-none');
        }

        if (targetHash === '#acerca-de') {
            acercaDeSection.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (targetHash === '#contacto-page') {
            contactoPageSection.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (targetHash === '#terminos' || targetHash === '#terminos-privacidad' || targetHash === '#terminos-cookies') {
            if (terminosSection) {
                terminosSection.classList.remove('d-none');
                window.scrollTo({ top: 0, behavior: 'smooth' });

                if (targetHash !== '#terminos') {
                    const targetElement = document.querySelector(targetHash);
                    if (targetElement) {
                        setTimeout(() => targetElement.scrollIntoView({ behavior: 'smooth' }), 150);
                    }
                }
            }
        } else {
            // Regresar a la Landing Page Principal
            mainContent.classList.remove('d-none');
            
            if (targetHash && targetHash !== '#inicio') {
                const targetElement = document.querySelector(targetHash);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }

    customLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const toggle = link.getAttribute('data-bs-toggle');

            if (toggle === 'modal' || href === '#demoModal') {
                return;
            }

            if (href && href.startsWith('#')) {
                e.preventDefault();
                handleNavigation(href);
                
                // Cierra el menú hamburguesa en dispositivos móviles
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse) bsCollapse.hide();
                }
            }
        });
    });

    // --- 2. CALCULADORA DE PRECIOS ÉTICA ---
    const userSlider = document.getElementById('userSlider');
    const userCountDisplay = document.getElementById('userCountDisplay');
    const tierSelect = document.getElementById('tierSelect');
    
    const infraCost = document.getElementById('infraCost');
    const supportCost = document.getElementById('supportCost');
    const devCost = document.getElementById('devCost');
    const profitCost = document.getElementById('profitCost');
    const totalCost = document.getElementById('totalCost');

    function calculatePricing() {
        if (!userSlider || !tierSelect) return;

        const users = parseInt(userSlider.value);
        const pricePerUser = parseFloat(tierSelect.value);
        const total = users * pricePerUser;

        userCountDisplay.textContent = users;

        const infra = total * 0.43;
        const support = total * 0.31;
        const dev = total * 0.09;
        const profit = total * 0.17;

        infraCost.textContent = `$${infra.toFixed(2)}`;
        supportCost.textContent = `$${support.toFixed(2)}`;
        devCost.textContent = `$${dev.toFixed(2)}`;
        profitCost.textContent = `$${profit.toFixed(2)}`;
        totalCost.textContent = `$${total.toFixed(2)} USD`;
    }

    if (userSlider && tierSelect) {
        userSlider.addEventListener('input', calculatePricing);
        tierSelect.addEventListener('change', calculatePricing);
        calculatePricing();
    }

    // --- 3. SIMULADOR DE CONSOLA EN TIEMPO REAL ---
    const logConsole = document.getElementById('logConsole');
    const sampleLogs = [
        "[NET] Bloqueada solicitud entrante no autorizada en puerto 8080.",
        "[SEC] Verificado handshake TLS 1.3 con nodo remoto.",
        "[ETHIC] Intento de acceso a cámara bloqueado por política de SO.",
        "[FLOW] Paquete perimetral validado: 64 bytes - Ping 12ms.",
        "[AUDIT] Colaborador consultó logs de actividad en tiempo real."
    ];

    if (logConsole) {
        setInterval(() => {
            const randomLog = sampleLogs[Math.floor(Math.random() * sampleLogs.length)];
            const logEntry = document.createElement('div');
            const timestamp = new Date().toLocaleTimeString();
            logEntry.textContent = `[${timestamp}] ${randomLog}`;
            logConsole.appendChild(logEntry);
            
            if (logConsole.children.length > 5) {
                logConsole.removeChild(logConsole.firstChild);
            }
            logConsole.scrollTop = logConsole.scrollHeight;
        }, 3500);
    }

    // --- 4. VERIFICADOR DE PRINCIPIOS ÉTICOS ---
    const ethicBtns = document.querySelectorAll('.ethic-filter-btn');
    const ethicTitle = document.getElementById('ethicTitle');
    const ethicDesc = document.getElementById('ethicDesc');
    const ethicMetric = document.getElementById('ethicMetric');

    const ethicData = {
        explicabilidad: {
            title: "// 1. Explicabilidad y Juicio Humano",
            desc: "Garantía de que ningún modelo de IA o algoritmo tomará determinaciones punitivas automáticas. El algoritmo solo alerta sobre patrones de red; la valoración moral y laboral recae siempre en la interacción humana contextualizada.",
            metric: "100% Casos Auditados por Comité Interno"
        },
        veto: {
            title: "// 2. Veto Arquitectónico a Herramientas Invasivas",
            desc: "Impedimento técnico a nivel de firmware/código que imposibilita la compilación de registradores de pulsaciones de teclas (keyloggers) o spyware de vigilancia directa en la pantalla del usuario.",
            metric: "0 Módulos Intrusivos en Repositorio"
        },
        desconexion: {
            title: "// 3. Desconexion Digital Garantizada",
            desc: "Suspensión programada de sockets de recolección al finalizar la jornada contractual. Mantiene el respeto absoluto al hogar y al descanso del trabajador.",
            metric: "Cierre de Sockets a las 18:00h Garantizado"
        },
        auditoria: {
            title: "// 4. Audit-Log Abierto y Paridad Informativa",
            desc: "Acceso democrático e irrestricto al historial de registros recopilados para que el empleado disponga exactamente de la misma información que el área directiva.",
            metric: "Portal de Transparencia 24/7 Disponible"
        }
    };

    ethicBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ethicBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            if (ethicData[filter]) {
                ethicTitle.textContent = ethicData[filter].title;
                ethicDesc.textContent = ethicData[filter].desc;
                ethicMetric.textContent = ethicData[filter].metric;
            }
        });
    });

    // --- 5. MODAL DE SIMULACIÓN Y FORMULARIO DE CONTACTO ---
    const btnSimulateAudit = document.getElementById('btnSimulateAudit');
    const modalAuditResult = document.getElementById('modalAuditResult');
    const modalAuditSummary = document.getElementById('modalAuditSummary');
    const modalAuditLines = document.getElementById('modalAuditLines');
    const auditNameInput = document.getElementById('auditName');
    const auditScenarioSelect = document.getElementById('auditScenario');

    const auditScenarioData = {
        traffic: {
            title: 'Análisis de Tráfico Perimetral',
            lines: [
                '✔ Conexión VPN Corporativa: Protegida',
                '✔ Paquetes Analizados: 14,209 (Filtro Perimetral)',
                '✔ Latencia promedio: 12ms',
                '✔ IP sospechosa bloqueada: 192.168.12.47',
                '✔ Política de privacidad respetada: 100%'
            ]
        },
        compliance: {
            title: 'Verificación de Cumplimiento Ético',
            lines: [
                '✔ Certificación de políticas: ACTIVA',
                '✔ Revisiones de telemetría: 28 registros auditados',
                '✔ Incidentes detectados: 0',
                '✔ Cumplimiento de GDPR: 100%',
                '✔ Documentación disponible: Sí'
            ]
        },
        privacy: {
            title: 'Revisión de Privacidad y Datos',
            lines: [
                '✔ Datos personales leídos: 0 bytes',
                '✔ Acceso a registros autorizados: Validado',
                '✔ Cookies de seguimiento: No aplicadas',
                '✔ Permisos de monitorización: Solo red corporativa',
                '✔ Estado de privacidad: Excelente'
            ]
        }
    };

    if (btnSimulateAudit && modalAuditResult && modalAuditSummary && modalAuditLines && auditScenarioSelect) {
        btnSimulateAudit.addEventListener('click', () => {
            const name = auditNameInput?.value.trim() || 'Colaborador';
            const scenario = auditScenarioSelect.value || 'traffic';
            const data = auditScenarioData[scenario] || auditScenarioData.traffic;

            modalAuditSummary.textContent = `Resultado para ${name}: ${data.title}`;
            modalAuditLines.innerHTML = data.lines.map(line => `<p class="mb-1">${line}</p>`).join('');
            modalAuditResult.classList.remove('d-none');
        });
    }

    const contactForm = document.getElementById('contactForm');
    const contactAlert = document.getElementById('contactAlert');

    if (contactForm && contactAlert) {
        contactForm.addEventListener('submit', () => {
            contactAlert.classList.remove('d-none');
            contactForm.reset();
            setTimeout(() => {
                contactAlert.classList.add('d-none');
            }, 6000);
        });
    }
});