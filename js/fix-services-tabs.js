/* ===================================================================== */
/* CORRECCIÓN ESPECÍFICA PARA TABS DE SERVICIOS */
/* Archivo: fix-services-tabs.js */
/* ===================================================================== */

console.log('🔧 Iniciando corrección de Tabs de Servicios...');

// =====================================================================
// CORRECCIÓN COMPLETA DEL SISTEMA DE TABS
// =====================================================================

const ServicesTabsFix = {
    isInitialized: false,
    currentTab: 'empresas',

    init() {
        if (this.isInitialized) return;

        console.log('📋 Corrigiendo Servicios Especializados por Audiencia...');

        if (!this.checkTabElements()) {
            console.error('❌ Elementos de tabs no encontrados');
            return;
        }

        this.applyTabCSS();
        this.reinitializeTabs();
        this.setInitialState();

        this.isInitialized = true;
        console.log('✅ Tabs de servicios corregidas exitosamente');
    },

    checkTabElements() {
        const elements = {
            section: document.querySelector('#servicios'),
            tabButtons: document.querySelectorAll('.tab-btn'),
            tabPanels: document.querySelectorAll('.tab-panel'),
            servicesGrid: document.querySelectorAll('.services-grid')
        };

        console.log('🔍 Verificando elementos de tabs:');
        Object.entries(elements).forEach(([name, element]) => {
            const exists = element && (element.length !== undefined ? element.length > 0 : true);
            console.log(`- ${name}:`, exists ? '✅' : '❌');

            if (name === 'tabPanels' && element.length > 0) {
                console.log('  Panels encontrados:', Array.from(element).map(p => p.id));
            }
        });

        return elements.section && elements.tabButtons.length > 0 && elements.tabPanels.length > 0;
    },

    applyTabCSS() {
        const tabCSS = `
            /* CORRECCIONES CRÍTICAS PARA TABS DE SERVICIOS */
            .services {
                padding: 100px 0 !important;
                background: linear-gradient(135deg, #001122 0%, #002244 25%, #003366 50%, #004488 75%, #001122 100%) !important;
                color: var(--white) !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .services-tabs {
                max-width: 1000px !important;
                margin: 0 auto !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .tab-buttons {
                display: flex !important;
                justify-content: center !important;
                gap: 0 !important;
                margin-bottom: 40px !important;
                background: transparent !important;
                border-radius: 8px !important;
                padding: 8px !important;
                visibility: visible !important;
            }
            
            .tab-btn {
                flex: 1 !important;
                padding: 16px 24px !important;
                background: transparent !important;
                border: none !important;
                color: #ffffff !important;
                font-weight: 600 !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                border-radius: 8px !important;
                white-space: nowrap !important;
                display: block !important;
                visibility: visible !important;
                min-width: auto !important;
            }
            
            .tab-btn:hover {
                background: rgba(255, 255, 255, 0.1) !important;
                color: #ffffff !important;
            }
            
            .tab-btn.active {
                background: var(--white) !important;
                color: var(--primary-color) !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
            }
            
            .tab-content {
                position: relative !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .tab-panel {
                display: none !important;
                opacity: 0 !important;
                transition: opacity 0.5s ease-in-out !important;
                visibility: hidden !important;
            }
            
            .tab-panel.active {
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                animation: fadeInTab 0.5s ease-in-out !important;
            }
            
            @keyframes fadeInTab {
                from { 
                    opacity: 0; 
                    transform: translateY(20px); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0); 
                }
            }
            
            .services-grid {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important;
                gap: 30px !important;
                visibility: visible !important;
            }
            
            .service-card {
                background: var(--white) !important;
                padding: 40px 30px !important;
                border-radius: 8px !important;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1) !important;
                text-align: center !important;
                transition: all 0.3s ease !important;
                border-top: 4px solid #39cccc !important;
                position: relative !important;
                overflow: hidden !important;
                display: block !important;
                visibility: visible !important;
            }
            
            .service-card:hover {
                transform: translateY(-8px) !important;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
            }
            
            .service-icon {
                font-size: 3rem !important;
                margin-bottom: 20px !important;
                display: block !important;
            }
            
            .service-card h3 {
                color: #ef4444 !important;
                font-size: 1.4rem !important;
                margin-bottom: 16px !important;
            }
            
            .service-card p {
                color: #718096 !important;
                margin-bottom: 20px !important;
                line-height: 1.6 !important;
            }
            
            .service-card ul {
                text-align: left !important;
                margin-bottom: 30px !important;
                color: #4A5568 !important;
                list-style: none !important;
                padding: 0 !important;
            }
            
            .service-card li {
                margin-bottom: 8px !important;
                position: relative !important;
                padding-left: 20px !important;
            }
            
            .service-card li::before {
                content: '✓' !important;
                position: absolute !important;
                left: 0 !important;
                color: #39cccc !important;
                font-weight: bold !important;
            }
            
            .service-cta {
                display: inline-block !important;
                background: linear-gradient(135deg, #2C5282, #39cccc) !important;
                color: var(--white) !important;
                padding: 12px 24px !important;
                border-radius: 8px !important;
                text-decoration: none !important;
                font-weight: 600 !important;
                transition: all 0.3s ease !important;
            }
            
            .service-cta:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important;
            }
            
            /* Responsive para tabs */
            @media (max-width: 768px) {
                .tab-buttons {
                    flex-wrap: wrap !important;
                    gap: 6px !important;
                    padding: 6px !important;
                }
                
                .tab-btn {
                    flex: 1 !important;
                    min-width: 100px !important;
                    font-size: 0.85rem !important;
                    padding: 10px 14px !important;
                }
                
                .services-grid {
                    grid-template-columns: 1fr !important;
                    gap: 25px !important;
                }
            }
            
            @media (max-width: 480px) {
                .tab-btn {
                    font-size: 0.8rem !important;
                    padding: 8px 10px !important;
                    min-width: 90px !important;
                }
            }
        `;

        const existingTabFix = document.getElementById('services-tabs-css-fix');
        if (existingTabFix) {
            existingTabFix.remove();
        }

        const style = document.createElement('style');
        style.id = 'services-tabs-css-fix';
        style.textContent = tabCSS;
        document.head.appendChild(style);

        console.log('🎨 CSS de tabs aplicado');
    },

    reinitializeTabs() {
        // Limpiar event listeners existentes
        const tabButtons = document.querySelectorAll('.tab-btn');

        tabButtons.forEach(button => {
            // Crear nuevo botón sin event listeners
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
        });

        // Configurar nuevos event listeners
        const newTabButtons = document.querySelectorAll('.tab-btn');
        newTabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = button.getAttribute('data-tab');
                console.log(`📋 Cambiando a tab: ${targetTab}`);
                this.switchTab(targetTab);
            });
        });

        console.log('🔄 Event listeners de tabs reconfigurados');
    },

    switchTab(targetTab) {
        if (!targetTab) {
            console.error('❌ Target tab no especificado');
            return;
        }

        console.log(`🔄 Cambiando a tab: ${targetTab}`);

        // Remover clases active de todos los botones
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        // Remover clases active de todos los paneles
        const tabPanels = document.querySelectorAll('.tab-panel');
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
        });

        // Activar botón correspondiente
        const activeButton = document.querySelector(`[data-tab="${targetTab}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
            console.log(`✅ Botón ${targetTab} activado`);
        } else {
            console.error(`❌ Botón para ${targetTab} no encontrado`);
        }

        // Activar panel correspondiente
        const activePanel = document.getElementById(targetTab);
        if (activePanel) {
            activePanel.classList.add('active');

            // Forzar animación
            activePanel.style.animation = 'none';
            activePanel.offsetHeight; // Trigger reflow
            activePanel.style.animation = 'fadeInTab 0.5s ease-in-out';

            console.log(`✅ Panel ${targetTab} activado`);
        } else {
            console.error(`❌ Panel para ${targetTab} no encontrado`);
        }

        // Actualizar estado interno
        this.currentTab = targetTab;

        // Analytics si está disponible
        this.trackTabChange(targetTab);
    },

    setInitialState() {
        console.log('🎯 Configurando estado inicial...');

        // Asegurar que el primer tab esté activo
        const firstButton = document.querySelector('.tab-btn[data-tab="empresas"]');
        const firstPanel = document.getElementById('empresas');

        if (firstButton && firstPanel) {
            // Limpiar todo primero
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));

            // Activar primero
            firstButton.classList.add('active');
            firstPanel.classList.add('active');

            this.currentTab = 'empresas';
            console.log('✅ Estado inicial configurado: empresas');
        } else {
            console.error('❌ No se pudo configurar estado inicial');
        }
    },

    trackTabChange(targetTab) {
        try {
            if (typeof Analytics !== 'undefined' && Analytics.trackEvent) {
                Analytics.trackEvent('Services', 'Tab Change', targetTab);
            }
        } catch (error) {
            // Silenciar errores de analytics
        }
    },

    // Método para testing
    testAllTabs() {
        const tabs = ['empresas', 'instituciones', 'investigadores', 'profesionales'];
        let currentIndex = 0;

        console.log('🧪 Probando todos los tabs...');

        const testNext = () => {
            if (currentIndex < tabs.length) {
                const tab = tabs[currentIndex];
                console.log(`🧪 Probando tab: ${tab}`);
                this.switchTab(tab);
                currentIndex++;
                setTimeout(testNext, 2000);
            } else {
                console.log('✅ Test de tabs completado');
                // Volver al primer tab
                this.switchTab('empresas');
            }
        };

        testNext();
    },

    // Método de diagnóstico
    diagnose() {
        console.log('🔍 === DIAGNÓSTICO DE TABS ===');

        const buttons = document.querySelectorAll('.tab-btn');
        const panels = document.querySelectorAll('.tab-panel');

        console.log(`Botones encontrados: ${buttons.length}`);
        console.log(`Paneles encontrados: ${panels.length}`);
        console.log(`Tab actual: ${this.currentTab}`);

        buttons.forEach((btn, index) => {
            const dataTab = btn.getAttribute('data-tab');
            const isActive = btn.classList.contains('active');
            console.log(`  Botón ${index}: data-tab="${dataTab}", active=${isActive}`);
        });

        panels.forEach((panel, index) => {
            const id = panel.id;
            const isActive = panel.classList.contains('active');
            const display = window.getComputedStyle(panel).display;
            console.log(`  Panel ${index}: id="${id}", active=${isActive}, display=${display}`);
        });

        console.log('=== FIN DIAGNÓSTICO ===');
    }
};

// =====================================================================
// INICIALIZACIÓN Y FUNCIONES GLOBALES
// =====================================================================

function initializeServicesFix() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                ServicesTabsFix.init();
            }, 500);
        });
    } else {
        setTimeout(() => {
            ServicesTabsFix.init();
        }, 500);
    }
}

// Funciones globales para debugging
window.debugServicesTabs = function() {
    ServicesTabsFix.diagnose();
};

window.testAllServicesTabs = function() {
    ServicesTabsFix.testAllTabs();
};

window.switchToTab = function(tabName) {
    ServicesTabsFix.switchTab(tabName);
};

window.forceFixServicesTabs = function() {
    console.log('🔧 Forzando corrección de tabs...');
    ServicesTabsFix.isInitialized = false;
    ServicesTabsFix.init();
};

// =====================================================================
// AUTO-INICIALIZACIÓN
// =====================================================================

// Ejecutar inmediatamente
initializeServicesFix();

// Respaldo en window.load
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!ServicesTabsFix.isInitialized) {
            console.log('🔄 Ejecutando corrección de respaldo para tabs...');
            ServicesTabsFix.init();
        }
    }, 1000);
});

console.log('📋 Fix de Tabs de Servicios cargado');
console.log('💡 Funciones de debug disponibles:');
console.log('   - debugServicesTabs() : Diagnóstico completo');
console.log('   - testAllServicesTabs() : Prueba todos los tabs');
console.log('   - switchToTab("empresas") : Cambiar a tab específico');
console.log('   - forceFixServicesTabs() : Forzar reinicialización');