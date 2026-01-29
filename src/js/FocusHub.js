import { ResizableWindow } from './ResizeableWindow.js';
import { ObjectDescription } from './ObjectDescription.js';

class FocusHub extends ResizableWindow {
    constructor(panel, name) {
        const container = document.querySelector('.focus-hub');
        const drag_handle = container.querySelector('.focus-hub-header');
        const content_container = container.querySelector('.focus-hub-content');

        super(container, drag_handle, content_container);

        this.name = name;
        this.panel = panel;
        this.$close_button = this.$container.querySelector('.focus-hub-header__close');

        this.$close_button.addEventListener('click', this.handle_close_button_click.bind(this));

        // Instanciar gerenciador de descrições
        this.objectDescription = new ObjectDescription();

        // Array de objetos para focar com label amigável e descrição
        this.focus_objects = [
            {
                id: 'Geom3D_2973',
                label: 'Geladeira Frente Loja',
                description: 'Geladeira expositora localizada na entrada da loja. Modelo Frost Free 400L.\n\nIdeal para exposição de produtos refrigerados de alto giro. Mantém temperatura constante entre 2°C e 6°C.'
            },
            {
                id: 'Geom3D_642',
                label: 'Geladeira Corredor',
                description: 'Geladeira vertical para bebidas. Capacidade para 120 latas.\n\nIluminação LED interna e porta de vidro duplo anti-embaçante.'
            },
            {
                id: 'Geom3D_Componente#19_3',
                label: 'Estante Dell vale',
                description: 'Estante de madeira para produtos secos. 5 prateleiras ajustáveis.\n\nMaterial resistente e design que facilita a reposição de produtos. Suporta até 50kg por prateleira.'
            }
        ];
    }

    init(scene_controller) {
        this.scene_controller = scene_controller;
        this.render_buttons();
    }

    set_focus_objects(objects_list) {
        if (Array.isArray(objects_list)) {
            this.focus_objects = objects_list;
            this.render_buttons();
        }
    }

    show() {
        this.$container.classList.remove('hidden');
    }

    hide() {
        this.$container.classList.add('hidden');
        this.objectDescription.hide();
        this.objectDescription.hide();
    }

    handle_close_button_click() {
        this.hide();
        this.panel.deactivate_button(this.name);
    }

    render_buttons() {
        this.$content_container.innerHTML = '';

        if (this.focus_objects.length === 0) {
            const empty_msg = document.createElement('div');
            empty_msg.style.padding = '10px';
            empty_msg.style.opacity = '0.7';
            empty_msg.textContent = 'No focus objects defined.';
            this.$content_container.appendChild(empty_msg);
            return;
        }

        this.focus_objects.forEach(item => {
            const objId = typeof item === 'string' ? item : item.id;
            const objLabel = typeof item === 'string' ? item : (item.label || item.id);
            const objDesc = typeof item === 'string' ? '' : (item.description || '');

            const btn = document.createElement('div');
            btn.className = 'focus-hub-button';
            btn.textContent = objLabel;
            btn.addEventListener('click', () => {
                this.handle_button_click(objId, btn, objLabel, objDesc);
            });
            this.$content_container.appendChild(btn);
        });
    }

    handle_button_click(name, btnElement, label, description) {
        const all_btns = this.$content_container.querySelectorAll('.focus-hub-button');
        all_btns.forEach(b => b.classList.remove('focus-hub-button--active'));

        const found = this.panel.handle_mesh_name_click(name);

        if (found) {
            btnElement.classList.add('focus-hub-button--active');
            this.objectDescription.show(label, description);

            // Auto-close on mobile (iPhone X / Smartphone)
            if (window.innerWidth <= 600) {
                setTimeout(() => {
                    this.handle_close_button_click();
                }, 0); // Pequeno delay para o usuário ver o feedback visual do clique
            }
        } else {
            console.warn(`FocusHub: Object '${name}' not found.`);
            btnElement.style.borderColor = '#ff4444';
            setTimeout(() => btnElement.style.borderColor = '', 500);
            this.objectDescription.hide();
        }
    }
}

export { FocusHub };
