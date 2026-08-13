document.addEventListener('DOMContentLoaded', () => {
    const welcomeLock = document.getElementById('welcomeLock');
    const loginForm = document.getElementById('loginForm');
    const loginError = document.getElementById('loginError');
    const logoutButton = document.getElementById('logoutButton');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const siteSidebar = document.getElementById('siteSidebar');
    const validEmail = 'admin@sentinelethos.com';
    const validPassword = 'Sentinel2026!';

    function toggleSidebar(forceState) {
        const shouldOpen = typeof forceState === 'boolean' ? forceState : !document.body.classList.contains('sidebar-open');
        document.body.classList.toggle('sidebar-open', shouldOpen);

        if (sidebarToggle) {
            sidebarToggle.setAttribute('aria-expanded', String(shouldOpen));
        }
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => toggleSidebar());
    }

    document.addEventListener('click', (event) => {
        const clickedInsideSidebar = siteSidebar && siteSidebar.contains(event.target);
        const clickedToggle = sidebarToggle && sidebarToggle.contains(event.target);

        if (!clickedInsideSidebar && !clickedToggle && document.body.classList.contains('sidebar-open')) {
            toggleSidebar(false);
        }
    });

    function unlockSite() {
        if (welcomeLock) {
            welcomeLock.classList.add('hidden');
        }
        document.body.classList.add('page-ready');
        localStorage.setItem('sentinelAuth', 'true');
    }

    function logOutSite() {
        localStorage.removeItem('sentinelAuth');
        if (welcomeLock) {
            welcomeLock.classList.remove('hidden');
        }
        document.body.classList.add('page-ready');
        if (loginForm) {
            loginForm.reset();
        }
        if (loginError) {
            loginError.textContent = '';
        }
        window.location.hash = '#inicio';
    }

    const isAuthenticated = localStorage.getItem('sentinelAuth') === 'true';
    if (isAuthenticated && welcomeLock) {
        welcomeLock.classList.add('hidden');
        document.body.classList.add('page-ready');
    } else {
        window.setTimeout(() => document.body.classList.add('page-ready'), 180);
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const email = document.getElementById('loginEmail')?.value.trim() || '';
            const password = document.getElementById('loginPassword')?.value || '';

            if (email === validEmail && password === validPassword) {
                loginError.textContent = '';
                unlockSite();
                return;
            }

            loginError.textContent = 'Credenciales incorrectas. Usa la demo indicada.';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', logOutSite);
    }

    const statCounters = document.querySelectorAll('.stat-count');
    statCounters.forEach(counter => {
        const target = Number(counter.dataset.target || 0);
        let current = 0;
        const speed = target > 100 ? 18 : 30;
        const tick = () => {
            current += Math.ceil(target / 12);
            if (current >= target) {
                counter.textContent = target;
                return;
            }
            counter.textContent = current;
            window.setTimeout(tick, speed);
        };
        tick();
    });

    // --- 1. ENRUTADOR DINÁMICO MULTIVISTA SPA (Home, Acerca de Nosotros, Contacto) ---
    const mainContent = document.getElementById('main-content');
    const acercaDeSection = document.getElementById('acerca-de');
    const contactoPageSection = document.getElementById('contacto-page');
    const terminosSection = document.getElementById('terminos');
    const ayudaSection = document.getElementById('ayuda');
    const customLinks = document.querySelectorAll('.nav-link-custom');

    const moduleButtons = document.querySelectorAll('.module-btn');
    const modulePanels = document.querySelectorAll('.module-panel');
    const modulePages = document.querySelectorAll('.module-page');

    function setActiveModuleButton(activeHash) {
        moduleButtons.forEach(button => {
            const target = button.getAttribute('data-target');
            button.classList.toggle('active', target === activeHash);
        });
    }

    if (moduleButtons.length && modulePages.length) {
        const defaultBtn = moduleButtons[0];
        const defaultTarget = defaultBtn.getAttribute('data-target');
        setActiveModuleButton(defaultTarget);
    }

    function hideAllViews() {
        if (mainContent) mainContent.classList.add('d-none');
        if (acercaDeSection) acercaDeSection.classList.add('d-none');
        if (contactoPageSection) contactoPageSection.classList.add('d-none');
        if (terminosSection) terminosSection.classList.add('d-none');
        if (ayudaSection) ayudaSection.classList.add('d-none');
        modulePages.forEach(page => page.classList.add('d-none'));
        modulePanels.forEach(panel => panel.classList.add('d-none'));
    }

    function applyInitialView() {
        const hash = window.location.hash || '#inicio';
        handleNavigation(hash);
    }

    window.addEventListener('hashchange', () => {
        handleNavigation(window.location.hash || '#inicio');
    });

    function handleNavigation(targetHash) {
        hideAllViews();

        if (targetHash === '#acerca-de' && acercaDeSection) {
            acercaDeSection.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (targetHash === '#contacto-page' && contactoPageSection) {
            contactoPageSection.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (targetHash === '#terminos' || targetHash === '#terminos-privacidad' || targetHash === '#terminos-cookies') {
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
            return;
        }

        if (targetHash === '#ayuda' && ayudaSection) {
            ayudaSection.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const matchingModule = [...modulePages].find(page => page.id === targetHash.replace('#', ''));
        if (matchingModule) {
            matchingModule.classList.remove('d-none');
            const activeTarget = '#' + matchingModule.id;
            setActiveModuleButton(activeTarget);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        if (mainContent) mainContent.classList.remove('d-none');
        if (targetHash && targetHash !== '#inicio') {
            const targetElement = document.querySelector(targetHash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    applyInitialView();

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

    // --- 6. MÓDULOS DEMO CLIENTE: Auditoría, Sesiones, 2FA, RBAC, Privacy, Whistle, Firma, Dashboard, Backup, API Keys ---

    function q(id) { return document.getElementById(id); }

    // Utility: SHA-256 hex
    async function sha256Hex(str) {
        const enc = new TextEncoder();
        const data = enc.encode(str);
        const hash = await crypto.subtle.digest('SHA-256', data);
        const hv = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2,'0')).join('');
        return hv;
    }

    // Module navigation
    moduleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            if (!target) return;
            setActiveModuleButton(target);
            const page = document.getElementById(target.replace('#', ''));
            if (page) {
                window.location.hash = target;
            } else {
                modulePanels.forEach(p => p.classList.add('d-none'));
                const panel = document.getElementById(target.replace('#', ''));
                if (panel) panel.classList.remove('d-none');
            }
        });
    });

    // --- Auditoría (demo) ---
    const auditListMini = q('audit-list-mini');
    const auditEvents = [];
    function pushAudit(level, msg) {
        const ev = { ts: new Date().toISOString(), level, msg };
        ev.hash = null;
        // compute hash for integrity
        sha256Hex(ev.ts + '|' + ev.level + '|' + ev.msg).then(h => { ev.hash = h; renderAudit(); });
        auditEvents.unshift(ev);
        if (auditEvents.length > 200) auditEvents.pop();
        renderAudit();
    }
    function renderAudit(filterLevel) {
        if (!auditListMini) return;
        auditListMini.innerHTML = auditEvents.filter(e => !filterLevel || filterLevel==='all' || e.level===filterLevel)
            .map(e => `<div>[${e.ts}] <strong>${e.level}</strong> ${e.msg} <span class="text-muted mono">${e.hash?e.hash.substring(0,12):'calculando...'}</span></div>`).join('');
    }
    // seed demo events
    pushAudit('info','Inicio de servicio de telemetría.');
    pushAudit('warn','Cambio de configuración detectado.');
    pushAudit('error','Intento de conexión prohibida.');

    q('audit-filter-mini')?.addEventListener('click', () => {
        const lvl = q('audit-level-mini')?.value || 'all'; renderAudit(lvl);
    });
    q('audit-export-mini')?.addEventListener('click', () => {
        // export CSV
        const csv = ['ts,level,msg,sha256'].concat(auditEvents.map(e => `${e.ts},${e.level},"${e.msg.replace(/"/g,'""')}",${e.hash||''}`)).join('\n');
        const blob = new Blob([csv], {type:'text/csv'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = 'audit_logs.csv'; a.click(); URL.revokeObjectURL(url);
    });

    // --- Sesiones (demo) ---
    const sessions = [
        {id:'s1', user:'ana@example.com', ip:'10.0.0.4', lastActive: Date.now()-1000*60*5},
        {id:'s2', user:'luis@example.com', ip:'10.0.0.27', lastActive: Date.now()-1000*60*60*5},
        {id:'s3', user:'marcela@example.com', ip:'10.0.0.9', lastActive: Date.now()-1000*60}
    ];
    function renderSessions() {
        const el = q('sessions-mini'); if(!el) return;
        el.innerHTML = sessions.map(s => `<div>${s.user} — ${s.ip} — ${Math.round((Date.now()-s.lastActive)/60000)}m <button data-id="${s.id}" class="btn btn-accent-sm ms-2 revoke">Revoke</button></div>`).join('');
        el.querySelectorAll('.revoke').forEach(b => b.addEventListener('click', (ev)=>{ const id=b.getAttribute('data-id'); revokeSession(id); }));
    }
    function revokeSession(id){ const idx = sessions.findIndex(s=>s.id===id); if(idx>=0){ sessions.splice(idx,1); renderSessions(); pushAudit('info',`Sesión ${id} revocada manualmente.`); }}
    q('revoke-inactive-mini')?.addEventListener('click', ()=>{
        const threshold = Date.now() - 1000*60*60; // 1h
        const removed = sessions.filter(s=>s.lastActive < threshold).map(s=>s.id);
        for(const id of removed) revokeSession(id);
        pushAudit('info',`Cierre remoto de ${removed.length} sesiones por inactividad.`);
    });
    renderSessions();

    // --- TOTP (demo secret generation) ---
    function randomBytesHex(n){ const a=new Uint8Array(n); crypto.getRandomValues(a); return Array.from(a).map(b=>b.toString(16).padStart(2,'0')).join(''); }
    function base32Encode(bytes){ const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; let bits=0, value=0, output=''; for(const b of bytes){ value = (value<<8) | b; bits += 8; while(bits >=5){ output += alphabet[(value >> (bits-5)) & 31]; bits -=5; } } if(bits>0) output += alphabet[(value << (5-bits)) & 31]; while(output.length%8!==0) output += '='; return output; }
    q('totp-enroll-mini')?.addEventListener('click', async ()=>{
        const buf = new Uint8Array(20); crypto.getRandomValues(buf); const secret = base32Encode(buf); q('totp-secret-mini').textContent = `SECRET: ${secret}\nOTPAUTH: otpauth://totp/SentinelEthos:demo?secret=${secret}&issuer=SentinelEthos`;
        pushAudit('info','Se generó secreto TOTP para enrolamiento (demo).');
    });

    // --- RBAC (demo) ---
    const rbacModules = ['Audit','Sesiones','2FA','RBAC','Privacy','Whistle'];
    const rbacRoles = ['Admin','Auditor','Empleado'];
    function renderRBAC(){ const container = q('rbac-mini'); if(!container) return; let html='<table class="table table-dark small"><thead><tr><th>Role / Module</th>' + rbacModules.map(m=>`<th>${m}</th>`).join('') + '</tr></thead><tbody>' + rbacRoles.map(r=>`<tr><th>${r}</th>` + rbacModules.map(m=>`<td><input type="checkbox" data-role="${r}" data-mod="${m}"></td>`).join('') + `</tr>`).join('') + '</tbody></table>'; container.innerHTML = html; }
    renderRBAC();

    // --- Privacy & ARCO (demo) ---
    const sampleUser = {id: 'user_42', name:'Carlos Ruiz', email:'carlos@example.com', created:'2024-02-12'};
    q('consent-mini')?.addEventListener('click', ()=>{ pushAudit('info','Consentimiento toggled (demo)'); q('privacy-log-mini').textContent = JSON.stringify({consent:'toggled', at:new Date().toISOString()},null,2); });
    q('export-personal-mini')?.addEventListener('click', ()=>{ const data = JSON.stringify(sampleUser,null,2); const blob = new Blob([data],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='personal_export.json'; a.click(); URL.revokeObjectURL(a.href); pushAudit('info','Exportación de datos personales (demo)'); });
    q('anonymize-mini')?.addEventListener('click', ()=>{ const token = 'USER_DELETED_' + randomBytesHex(4); q('privacy-log-mini').textContent = `Anonymized id: ${token}`; pushAudit('warn',`Derecho al Olvido aplicado: ${token}`); });

    // --- Whistleblower (client-side encryption demo) ---
    async function encryptReport(text){ const key = await crypto.subtle.generateKey({name:'AES-GCM', length:256}, true, ['encrypt','decrypt']); const iv = crypto.getRandomValues(new Uint8Array(12)); const enc = new TextEncoder(); const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, enc.encode(text)); const hash = await sha256Hex(String.fromCharCode(...new Uint8Array(ct)));
        return {cipher: btoa(String.fromCharCode(...new Uint8Array(ct))), iv: Array.from(iv).map(n=>n.toString(16).padStart(2,'0')).join(''), tracking: hash}; }
    q('whistle-send-mini')?.addEventListener('click', async ()=>{
        const txt = q('whistle-text-mini')?.value || ''; if(!txt) return; const res = await encryptReport(txt); q('whistle-result-mini').textContent = `Encrypted (base64)...\nTracking: ${res.tracking}`; pushAudit('info','Denuncia anónima enviada (demo), tracking generado.');
    });

    // --- Firma Digital / Contrato ---
    q('sign-contract-mini')?.addEventListener('click', async ()=>{
        const text = q('contract-text-mini')?.value || '';
        const h = await sha256Hex(text + '|' + new Date().toISOString());
        q('sign-result-mini').textContent = `SHA-256: ${h}\nTimestamp: ${new Date().toISOString()}`;
        pushAudit('info','Contrato firmado digitalmente (demo).');
    });

    // --- Dashboard (demo metrics) ---
    function updateDashboard(){ q('metric-users-mini').textContent = Math.floor(Math.random()*200); q('metric-peak-mini').textContent = (8+Math.floor(Math.random()*10))+':00'; q('metric-volume-mini').textContent = Math.floor(Math.random()*5000); }
    setInterval(updateDashboard,4000); updateDashboard();

    // --- Backup Center (demo) ---
    q('backup-run-mini')?.addEventListener('click', ()=>{ const log = q('backup-log-mini'); if(!log) return; const line = `[${new Date().toISOString()}] Backup demo completado.`; log.textContent = line + '\n' + log.textContent; pushAudit('info','Backup ejecutado (demo).'); });

    // --- API Keys generation (demo) ---
    q('api-gen-mini')?.addEventListener('click', ()=>{
        const name = q('api-name-mini')?.value || 'demo'; const perms = Array.from(q('api-perm-mini')?.selectedOptions||[]).map(o=>o.value).join(','); const token = randomBytesHex(16);
        q('api-result-mini').textContent = `Key: ${token}\nName: ${name}\nPerms: ${perms}`;
        pushAudit('info',`API Key generada: ${name} perms=${perms}`);
    });

    // small initial render
    renderAudit(); renderSessions(); renderRBAC();
});