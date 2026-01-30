import { ResizableWindow } from './ResizeableWindow.js';

class ObjectDescription extends ResizableWindow
{
  constructor()
  {
    let container = document.querySelector('.object-description-window');

    if (!container)
    {
      console.warn('ObjectDescription: Element .object-description-window not found in DOM. Creating dynamically.');
      container = ObjectDescription._create_html_structure();
      document.body.appendChild(container); // Adiciona ao body
    }

    const drag_handle = container.querySelector('.resize-grab-handle');
    const content_container = container.querySelector('.resize-content-wrapper');

    super(container, drag_handle, content_container);

    this.$title = container.querySelector('.object-description-window__title');
    this.$close_button = container.querySelector('.object-description-window__close');
    this.$content = container.querySelector('.object-description-window__content');

    this.$close_button.addEventListener('click', this.hide.bind(this));

    // Ajuste inicial de posição (Top Right)
    this.$container.style.left = 'auto';
    this.$container.style.right = '20px';
    this.$container.style.top = '20px';
    this.$container.style.width = '350px';
    this.$container.style.height = 'auto';
    this.$content_container.style.height = 'auto';
    this.$content_container.style.minHeight = '100px';
    this.min_height = 100;

    // Ensure default visibility is ok (hidden class controls it)
    // this.$container.style.display = 'flex'; // REMOVIDO: Isso forçava a visibilidade ignorando a classe hidden
  }

  static _create_html_structure()
  {
    const div = document.createElement('div');
    div.className = 'resize-window object-description-window hidden';
    div.innerHTML = `
            <div class="resize-grab-handle">
                <div class="object-description-window__title">Informações do Item</div>
                <div class="object-description-window__close">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
            <div class="resize-content-wrapper">
                <div class="resize-content">
                    <div class="object-description-window__content"></div>
                </div>
            </div>
        `;
    return div;
  }

  show(title, description)
  {
    if (!description)
    {
      this.hide();
      return;
    }

    this.$title.textContent = title;
    this.$content.innerText = description; // Usar innerText para preservar quebras de linha

    this.$container.classList.remove('hidden');
    this.bring_forward();
  }

  hide()
  {
    this.$container.classList.add('hidden');
  }
}

export { ObjectDescription };
