/* ===================================================================== */
/* MODULO: FORMULARIO DE CONTACTO - VERSION CORREGIDA Y MEJORADA */
/* ===================================================================== */

const ContactOptions = {
    isInitialized: false,
    form: null,
    retryAttempts: 0,
    maxRetries: 3,

    init() {
        if (this.isInitialized) {
            console.log('ContactOptions ya inicializado');
            return;
        }

        console.log('🚀 Inicializando ContactOptions...');
        
        // Intentar encontrar el formulario de múltiples maneras
        if (this.findAndBindForm()) {
            this.isInitialized = true;
            console.log('✅ ContactOptions inicializado exitosamente');
        } else {
            console.warn('⚠️ Formulario no encontrado en la inicialización. Reintentando...');
            this.retryInitialization();
        }
    },

    findAndBindForm() {
        // Método 1: Buscar formulario directamente
        this.form = document.getElementById('contactForm');
        
        if (this.form) {
            console.log('✅ Formulario encontrado directamente');
            this.bindEvents();
            return true;
        }

        // Método 2: Buscar dentro del contenedor (puede estar oculto)
        const container = document.getElementById('contactFormContainer');
        if (container) {
            this.form = container.querySelector('#contactForm');
            if (this.form) {
                console.log('✅ Formulario encontrado en contenedor');
                this.bindEvents();
                return true;
            }
        }

        // Método 3: Buscar cualquier formulario con clase específica
        this.form = document.querySelector('.contact-form form');
        if (this.form) {
            console.log('✅ Formulario encontrado por clase CSS');
            this.bindEvents();
            return true;
        }

        console.error('❌ Formulario de contacto no encontrado en ninguna ubicación');
        return false;
    },

    retryInitialization() {
        if (this.retryAttempts >= this.maxRetries) {
            console.error('❌ Se agotaron los intentos de inicialización del formulario');
            return;
        }

        this.retryAttempts++;
        console.log(`🔄 Reintento ${this.retryAttempts}/${this.maxRetries} en 1 segundo...`);

        setTimeout(() => {
            if (this.findAndBindForm()) {
                this.isInitialized = true;
                console.log('✅ ContactOptions inicializado exitosamente en reintento');
            } else {
                this.retryInitialization();
            }
        }, 1000);
    },

    bindEvents() {
        if (!this.form) {
            console.error('❌ No se puede vincular eventos: formulario no encontrado');
            return;
        }

        const inputs = this.form.querySelectorAll('input, select, textarea');

        if (inputs.length === 0) {
            console.error('❌ No se encontraron campos de entrada en el formulario');
            return;
        }

        // Validación en tiempo real
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });

        // Envío del formulario
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        console.log('✅ Event listeners configurados para', inputs.length, 'campos');

        // Verificar que los elementos necesarios existen
        this.verifyFormElements();
    },

    verifyFormElements() {
        const requiredElements = {
            'submit button': this.form.querySelector('button[type="submit"]'),
            'name field': this.form.querySelector('#name, [name="name"]'),
            'email field': this.form.querySelector('#email, [name="email"]'),
            'message field': this.form.querySelector('#message, [name="message"]')
        };

        let allFound = true;
        Object.entries(requiredElements).forEach(([name, element]) => {
            if (!element) {
                console.warn(`⚠️ Elemento faltante: ${name}`);
                allFound = false;
            } else {
                console.log(`✅ ${name} encontrado`);
            }
        });

        return allFound;
    },

    validateField(field) {
        const value = field.value.trim();
        const fieldType = field.type;
        const isRequired = field.hasAttribute('required');

        let isValid = true;
        let errorMessage = '';

        // Validación de campos requeridos
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'Este campo es obligatorio';
        }

        // Validación de email
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un email válido';
            }
        }

        // Validación de teléfono (si está presente)
        if (field.name === 'phone' && value) {
            const phoneRegex = /^[\+]?[0-9\s\-\(\)]{7,15}$/;
            if (!phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor ingresa un teléfono válido';
            }
        }

        // Validación de select
        if (field.tagName === 'SELECT' && isRequired && !value) {
            isValid = false;
            errorMessage = 'Por favor selecciona una opción';
        }

        // Validación de longitud del mensaje
        if (field.name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'El mensaje debe tener al menos 10 caracteres';
        }

        // Validación de longitud del nombre
        if (field.name === 'name' && value && value.length < 2) {
            isValid = false;
            errorMessage = 'El nombre debe tener al menos 2 caracteres';
        }

        this.displayFieldValidation(field, isValid, errorMessage);
        return isValid;
    },

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    },

    displayFieldValidation(field, isValid, errorMessage) {
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;

        const errorElement = formGroup.querySelector('.error-message');

        if (isValid) {
            formGroup.classList.remove('error');
            if (errorElement) errorElement.textContent = '';
        } else {
            formGroup.classList.add('error');
            if (errorElement) errorElement.textContent = errorMessage;
        }
    },

    async handleFormSubmit(e) {
        e.preventDefault();
        console.log('📋 Formulario enviado - iniciando validación');

        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');

        // Prevenir envíos duplicados
        if (submitBtn.disabled) {
            console.log('⚠️ Envío duplicado prevenido');
            return false;
        }

        const inputs = form.querySelectorAll('input, select, textarea');
        let isFormValid = true;

        // Validar todos los campos
        inputs.forEach(input => {
            const isFieldValid = this.validateField(input);
            if (!isFieldValid) {
                isFormValid = false;
            }
        });

        console.log('✅ Validación completa. Formulario válido:', isFormValid);

        if (isFormValid) {
            // Deshabilitar botón inmediatamente
            submitBtn.disabled = true;
            await this.submitForm(form);
        } else {
            // Scroll al primer error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    },

    async submitForm(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        console.log('📤 Iniciando envío del formulario');

        try {
            // Mostrar estado de carga
            this.showLoadingState(submitBtn, true);

            // Recopilar datos del formulario
            const formData = this.getFormData(form);
            console.log('📊 Datos recopilados:', formData);

            // Enviar al servidor
            const response = await this.sendToServer(formData);
            console.log('📥 Respuesta recibida:', response);

            if (response && response.success) {
                console.log('✅ Envío exitoso');
                this.showFormSuccess(response.data || {});

                // Resetear formulario
                form.reset();
                this.clearAllErrors(form);

                // Cerrar formulario después de un delay
                setTimeout(() => {
                    this.closeContactForm();
                }, 3000);

                // Tracking
                if (typeof Analytics !== 'undefined') {
                    Analytics.trackEvent('Form', 'Submit Success', 'Contact Form');
                }
            } else {
                console.error('❌ Error del servidor:', response);
                const errorMsg = (response && response.message) || 'Error al enviar el formulario';
                this.showFormError(errorMsg);

                if (typeof Analytics !== 'undefined') {
                    Analytics.trackEvent('Form', 'Submit Error', errorMsg);
                }
            }

        } catch (error) {
            console.error('❌ ERROR al enviar formulario:', error);
            
            // Manejar diferentes tipos de errores
            let errorMessage = 'Error de conexión. Por favor, inténtalo más tarde.';
            
            if (error.message.includes('429')) {
                errorMessage = 'Has enviado un mensaje recientemente. Espera unos minutos antes de enviar otro.';
            } else if (error.message.includes('400')) {
                errorMessage = 'Error en los datos enviados. Por favor, verifica la información.';
            } else if (error.message.includes('500')) {
                errorMessage = 'Error interno del servidor. Por favor, contacta al administrador.';
            }
            
            this.showFormError(errorMessage);

            if (typeof Analytics !== 'undefined') {
                Analytics.trackEvent('Form', 'Submit Error', 'Connection Error');
            }
        } finally {
            // Restaurar botón
            this.showLoadingState(submitBtn, false, originalText);
        }
    },

    getFormData(form) {
        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }

        // Validar datos antes de enviar
        if (!data.name || !data.email || !data.message) {
            throw new Error('Datos incompletos en el formulario');
        }

        console.log('✅ Datos del formulario procesados:', data);
        return data;
    },

    async sendToServer(data) {
        const url = '/php/contact_processor.php';
        console.log('🌐 Enviando a URL:', url);

        try {
            // Intento principal con JSON
            console.log('📡 Intentando envío con JSON...');
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest' // Añadir header para identificar AJAX
                },
                body: JSON.stringify(data)
            });

            console.log('📊 Response status:', response.status);
            console.log('📊 Response ok:', response.ok);

            // Manejar códigos de estado específicos
            if (response.status === 429) {
                throw new Error('HTTP 429: Rate limit exceeded');
            }

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Error response:', errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            console.log('📋 Content-Type:', contentType);

            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('❌ Respuesta no JSON:', text);
                
                // Intentar parsear como JSON de todas formas
                try {
                    return JSON.parse(text);
                } catch (parseError) {
                    throw new Error('El servidor no devolvió JSON válido');
                }
            }

            const result = await response.json();
            console.log('✅ Respuesta JSON parseada:', result);
            return result;

        } catch (error) {
            console.error('❌ Error en envío JSON:', error);

            // Intento de respaldo con FormData solo si no es rate limit
            if (!error.message.includes('429')) {
                try {
                    console.log('🔄 Intentando método de respaldo con FormData...');
                    return await this.sendWithFormData(data, url);
                } catch (fallbackError) {
                    console.error('❌ Error en método de respaldo:', fallbackError);
                }
            }
            
            throw error; // Lanzar el error original
        }
    },

    async sendWithFormData(data, url) {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        });

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: formData
        });

        console.log('📊 FormData response status:', response.status);

        if (!response.ok) {
            const text = await response.text();
            console.error('❌ Error response text:', text);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            const text = await response.text();
            console.log('📄 Response text:', text);
            // Intentar parsear como JSON manualmente
            try {
                return JSON.parse(text);
            } catch (e) {
                throw new Error('Respuesta del servidor no es JSON válido');
            }
        }
    },

    showLoadingState(button, isLoading, originalText = 'Enviar Consulta Gratuita') {
        if (isLoading) {
            button.innerHTML = `
                <span style="display: inline-flex; align-items: center; gap: 8px;">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                        <path d="M21 12a9 9 0 11-6.219-8.56"/>
                    </svg>
                    Enviando...
                </span>
            `;
            button.disabled = true;
            button.classList.add('loading');
        } else {
            button.textContent = originalText;
            button.disabled = false;
            button.classList.remove('loading');
        }
    },

    showFormSuccess(data) {
        console.log('🎉 Mostrando mensaje de éxito');
        const form = this.form || document.getElementById('contactForm');
        if (!form) {
            console.error('❌ No se puede mostrar mensaje de éxito: formulario no encontrado');
            return;
        }

        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #38A169, #48BB78);
                color: white;
                padding: 25px;
                border-radius: 12px;
                margin: 20px 0;
                text-align: center;
                box-shadow: 0 8px 25px rgba(56, 161, 105, 0.3);
                animation: slideInUp 0.6s ease-out;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <div style="font-size: 3rem; margin-bottom: 15px;">🎉</div>
                <h3 style="margin: 0 0 10px 0; font-size: 1.4rem; font-weight: 700;">
                    ${data.message || 'Mensaje enviado exitosamente!'}
                </h3>
                <p style="margin: 0; opacity: 0.95; font-size: 1rem; line-height: 1.5;">
                    ${data.details || 'Te contactaremos pronto para agendar tu consulta gratuita.'}
                </p>
                ${data.contact_id ? `
                    <div style="margin-top: 15px; padding: 10px; background: rgba(255, 255, 255, 0.1); border-radius: 6px; font-size: 0.9rem;">
                        <strong>ID de consulta:</strong> #${data.contact_id}
                    </div>
                ` : ''}
                <div style="margin-top: 20px; font-size: 0.9rem; opacity: 0.8;">
                    Este formulario se cerrará automáticamente en unos segundos
                </div>
            </div>
        `;

        // Insertar antes del formulario
        form.parentNode.insertBefore(successMessage, form);

        // Scroll al mensaje de éxito
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remover mensaje después de 5 segundos
        setTimeout(() => {
            if (successMessage.parentNode) {
                successMessage.remove();
            }
        }, 5000);
    },

    showFormError(message) {
        console.log('⚠️ Mostrando mensaje de error:', message);
        const form = this.form || document.getElementById('contactForm');
        if (!form) {
            console.error('❌ No se puede mostrar mensaje de error: formulario no encontrado');
            return;
        }

        const errorMessage = document.createElement('div');
        errorMessage.className = 'form-error-message';
        errorMessage.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #E53E3E, #FC8181);
                color: white;
                padding: 20px;
                border-radius: 12px;
                margin: 20px 0;
                text-align: center;
                box-shadow: 0 8px 25px rgba(229, 62, 62, 0.3);
                animation: slideInUp 0.6s ease-out;
                border: 1px solid rgba(255, 255, 255, 0.2);
            ">
                <div style="font-size: 2.5rem; margin-bottom: 15px;">⚠️</div>
                <h3 style="margin: 0 0 10px 0; font-size: 1.3rem; font-weight: 700;">
                    Error al enviar el mensaje
                </h3>
                <p style="margin: 0; opacity: 0.95; font-size: 1rem; line-height: 1.5;">
                    ${message}
                </p>
                <div style="margin-top: 15px; font-size: 0.9rem; opacity: 0.8;">
                    Por favor, revisa los datos e inténtalo nuevamente
                </div>
            </div>
        `;

        // Insertar antes del formulario
        form.parentNode.insertBefore(errorMessage, form);

        // Scroll al mensaje de error
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Remover mensaje después de 7 segundos
        setTimeout(() => {
            if (errorMessage.parentNode) {
                errorMessage.remove();
            }
        }, 7000);
    },

    clearAllErrors(form) {
        const errorElements = form.querySelectorAll('.form-group.error');
        errorElements.forEach(element => {
            element.classList.remove('error');
            const errorMsg = element.querySelector('.error-message');
            if (errorMsg) errorMsg.textContent = '';
        });
    },

    closeContactForm() {
        const formContainer = document.getElementById('contactFormContainer');
        if (formContainer && formContainer.style.display === 'block') {
            formContainer.style.display = 'none';
            document.body.style.overflow = '';
            console.log('📋 Formulario de contacto cerrado');
        }
    },

    // Métodos públicos para debugging
    getStatus() {
        return {
            initialized: this.isInitialized,
            formFound: !!this.form,
            retryAttempts: this.retryAttempts,
            formElementsCount: this.form ? this.form.querySelectorAll('input, select, textarea').length : 0
        };
    },

    forceReinitialize() {
        this.isInitialized = false;
        this.form = null;
        this.retryAttempts = 0;
        this.init();
    }
};

/* ===================================================================== */
/* FUNCIONES GLOBALES */
/* ===================================================================== */

function toggleContactForm() {
    const formContainer = document.getElementById('contactFormContainer');
    if (!formContainer) {
        console.error('❌ Contenedor del formulario no encontrado');
        return;
    }

    const isVisible = formContainer.style.display === 'block';

    if (isVisible) {
        formContainer.style.display = 'none';
        document.body.style.overflow = '';
        if (typeof Analytics !== 'undefined') {
            Analytics.trackEvent('Contact', 'Form Close', 'Contact Form');
        }
        console.log('📋 Formulario cerrado por usuario');
    } else {
        formContainer.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Re-inicializar si es necesario
        if (!ContactOptions.isInitialized) {
            console.log('🔄 Re-inicializando ContactOptions al abrir formulario');
            ContactOptions.init();
        }
        
        if (typeof Analytics !== 'undefined') {
            Analytics.trackEvent('Contact', 'Form Open', 'Contact Form');
        }
        console.log('📋 Formulario abierto por usuario');
    }
}

// Función de debug global
function debugContactForm() {
    console.log('🔍 === DEBUG CONTACTOPTIONS ===');
    console.log('Estado actual:', ContactOptions.getStatus());
    
    const form = document.getElementById('contactForm');
    const container = document.getElementById('contactFormContainer');
    
    console.log('Elementos DOM:');
    console.log('- Formulario encontrado:', !!form);
    console.log('- Contenedor encontrado:', !!container);
    
    if (form) {
        console.log('- Campos encontrados:', form.querySelectorAll('input, select, textarea').length);
        console.log('- Submit button encontrado:', !!form.querySelector('button[type="submit"]'));
    }
    
    console.log('=== FIN DEBUG ===');
}

// Hacer función disponible globalmente
window.debugContactForm = debugContactForm;

/* ===================================================================== */
/* ESTILOS CSS */
/* ===================================================================== */

const contactFormStyles = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    .form-success-message,
    .form-error-message {
        z-index: 10000;
        position: relative;
    }
    
    .btn.loading {
        pointer-events: none;
        opacity: 0.8;
    }
    
    .form-group.error input,
    .form-group.error select,
    .form-group.error textarea {
        border-color: #E53E3E !important;
        box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1) !important;
    }
    
    .error-message {
        color: #E53E3E;
        font-size: 0.875rem;
        margin-top: 4px;
        display: block;
        min-height: 20px;
        font-weight: 500;
    }

    .field-help {
        font-size: 0.75rem;
        color: #666;
        margin-top: 4px;
        display: block;
    }
`;

// Crear elemento de estilo si no existe
if (!document.getElementById('contact-form-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'contact-form-styles';
    styleElement.textContent = contactFormStyles;
    document.head.appendChild(styleElement);
}

/* ===================================================================== */
/* INICIALIZACIÓN MEJORADA */
/* ===================================================================== */

// Función de inicialización segura
function initializeContactOptions() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => ContactOptions.init(), 100);
        });
    } else {
        // DOM ya está cargado
        setTimeout(() => ContactOptions.init(), 100);
    }
}

// Inicializar inmediatamente si el DOM está listo, o esperar a que se cargue
initializeContactOptions();

// También inicializar cuando se carga la ventana (fallback)
window.addEventListener('load', () => {
    if (!ContactOptions.isInitialized) {
        console.log('🔄 Inicializando ContactOptions en evento window.load');
        ContactOptions.init();
    }
});

console.log('📋 Módulo de formulario de contacto cargado (versión mejorada)');