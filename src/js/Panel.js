import { Animations } from './Animations';
import { Geometries } from './Geometries';
import { HierarchyTree } from './HierarchyTree';
import { Info } from './Info';
import { Materials } from './Materials';
import { Textures } from './Textures';
import { FocusHub } from './FocusHub.js';

class Panel {
  constructor(ui_controller) {
    this.$container = document.querySelector('.panel');
    this.$buttons_container = document.querySelector('.panel-buttons');
    this.$content = document.querySelector('.panel-content');

    this.ui_controller = ui_controller;

    // Manter apenas FocusHub ativo como solicitado
    this.contents = {
      focus_hub: new FocusHub(this, 'focus_hub'),
      /*
      hierarchy: new HierarchyTree(this, 'hierarchy'),
      textures: new Textures(this, 'textures'),
      materials: new Materials(this, 'materials'),
      geometries: new Geometries(this, 'geometries'),
      info: new Info(this, 'info'),
      animations: new Animations(this, 'animations')
      */
    };

    this.buttons = {
      focus_hub: this.$buttons_container.querySelector('.panel-button[data-name="focus_hub"]'),
      /*
      hierarchy: this.$buttons_container.querySelector('.panel-button[data-name="hierarchy"]'),
      textures: this.$buttons_container.querySelector('.panel-button[data-name="textures"]'),
      materials: this.$buttons_container.querySelector('.panel-button[data-name="materials"]'),
      geometries: this.$buttons_container.querySelector('.panel-button[data-name="geometries"]'),
      info: this.$buttons_container.querySelector('.panel-button[data-name="info"]'),
      animations: this.$buttons_container.querySelector('.panel-button[data-name="animations"]')
      */
    };

    // Esconde botões desativados visualmente
    const buttons_to_hide = ['hierarchy', 'textures', 'materials', 'geometries', 'info', 'animations'];
    buttons_to_hide.forEach(name => {
      const btn = this.$buttons_container.querySelector(`.panel-button[data-name="${name}"]`);
      if (btn) btn.style.display = 'none';
    });

    for (const button of Object.values(this.buttons)) {
      if (button) { // Check if button exists (in case we comment out above)
        button.addEventListener('click', this.handle_button_click.bind(this, button));
      }
    }
  }

  update_contents(object3d) {
    // this.contents.hierarchy.build_hierarchy_tree(object3d);
    // this.contents.textures.update_contents(object3d);
    // this.contents.materials.update_contents(object3d);
    // this.contents.geometries.update_contents(object3d);
  }

  handle_object_click(object3d) {
    this.ui_controller.handle_object_click(object3d);
  }

  handle_mesh_name_click(mesh_name) {
    /* 
    // Hierarchy removed, so we can't search via hierarchy tree directly in the same way if it depends on UI
    // But maybe we need a way to find objects if FocusHub relies on this?
    // FocusHub uses handle_mesh_name_click to focus. 
    // If HierarchyTree is gone, we might lose 'find_object3d_by_name'.
    // Let's check HierarchyTree implementation or see if we can substitute.
    */

    // Temporary fallback: try to find via scene_controller if hierarchy is disabled
    if (this.scene_controller && this.scene_controller.scene) {
      const object3d = this.scene_controller.scene.getObjectByName(mesh_name);
      if (object3d) {
        this.ui_controller.handle_object_click(object3d);
        return true;
      }
    }

    /* Original code
    const object3d = this.contents.hierarchy.find_object3d_by_name(mesh_name);
    if (object3d) {
      this.ui_controller.handle_object_click(object3d);
      return true;
    }
    */
  }

  init(scene_controller, details_panel) {
    this.scene_controller = scene_controller;
    scene_controller.subscribe(this);

    // this.contents.info.init(scene_controller);
    // this.contents.textures.init(scene_controller);

    this.contents.focus_hub.init(scene_controller);

    // this.contents.hierarchy.init(scene_controller, details_panel);

    this.open_panel();
  }

  on_model_loaded(model) {
    /*
    if (this.contents.info.get_texture_count() > 0) {
      this.buttons.textures.classList.remove('hidden');
    }

    if (this.contents.materials.get_material_count() > 0) {
      this.buttons.materials.classList.remove('hidden');
    }

    if (this.contents.geometries.get_geometries_count() > 0) {
      this.buttons.geometries.classList.remove('hidden');
    }

    if (this.contents.info.get_animation_count() > 0) {
      this.buttons.animations.classList.remove('hidden');
      this.contents.animations.init(this.scene_controller);
    }
    */
  }

  handle_button_click(button) {
    const button_name = button.dataset.name;
    const content = this.contents[button_name];

    if (!content) return; // Guard clause

    if (button.classList.contains('panel-button--active')) {
      if (content.is_focused()) {
        content.shake();
      }
      content.bring_forward();
    }
    else {
      if (!content.has_changed) {
        const position = this.calculate_initial_position();
        content.$container.style.top = `${position.top}px`;
        content.$container.style.left = `${position.left}px`;
      }

      content.show();
      content.bring_forward();
      this.set_active_button(button_name);
    }
  }

  set_active_button(button_name) {
    this.close_panel();

    // Only attempt to toggle class if button reference exists
    if (this.buttons[button_name]) {
      this.buttons[button_name].classList.add('panel-button--active');
    }
  }

  deactivate_button(button_name) {
    if (this.buttons[button_name]) {
      this.buttons[button_name].classList.remove('panel-button--active');
    }

    if (this.$buttons_container.querySelector('.panel-button--active') === null) {
      this.open_panel();
    }
  }

  open_panel() {
    this.$buttons_container.classList.add('panel-buttons--open');
  }

  close_panel() {
    this.$buttons_container.classList.remove('panel-buttons--open');
  }

  calculate_initial_position() {
    const positions = [];
    const startTop = 10;
    const startLeft = 60;
    const step = 25;

    for (const [name, content] of Object.entries(this.contents)) {
      if (this.buttons[name] && this.buttons[name].classList.contains('panel-button--active')) {
        const rect = content.$container.getBoundingClientRect();
        positions.push({
          top: rect.top,
          left: rect.left
        });
      }
    }

    const find_available_position = (top, left) => {
      for (const pos of positions) {
        if (Math.abs(pos.top - top) < step && Math.abs(pos.left - left) < step) {
          return find_available_position(top + step, left + step);
        }
      }
      return { top, left };
    };

    return find_available_position(startTop, startLeft);
  }
}

export { Panel };
