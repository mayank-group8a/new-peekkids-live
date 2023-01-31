function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}

const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function() {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function(event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  elementToFocus.focus();
}

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('product-model').forEach((model) => model.modelViewerUI?.pause());
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true })

    this.querySelectorAll('button').forEach(
      (button) => button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define('quantity-input', QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

const serializeForm = form => {
  const obj = {};
  const formData = new FormData(form);
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return JSON.stringify(obj);
};

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

/*
 * Shopify Common JS
 *
 */
if ((typeof window.Shopify) == 'undefined') {
  window.Shopify = {};
}

Shopify.bind = function(fn, scope) {
  return function() {
    return fn.apply(scope, arguments);
  }
};

Shopify.setSelectorByValue = function(selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function(target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
};

Shopify.postLink = function(path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for(var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
  this.countryEl         = document.getElementById(country_domid);
  this.provinceEl        = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function() {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function() {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function(e) {
    var opt       = this.countryEl.options[this.countryEl.selectedIndex];
    var raw       = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function(selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function(selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector('details');
    const summaryElements = this.querySelectorAll('summary');
    this.addAccessibilityAttributes(summaryElements);

    if (navigator.platform === 'iPhone') document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);

    this.addEventListener('keyup', this.onKeyUp.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
    this.querySelectorAll('button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
  }

  addAccessibilityAttributes(summaryElements) {
    summaryElements.forEach(element => {
      element.setAttribute('role', 'button');
      element.setAttribute('aria-expanded', false);
      element.setAttribute('aria-controls', element.nextElementSibling.id);
    });
  }

  onKeyUp(event) {
    if(event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if(!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle ? this.closeMenuDrawer(this.mainDetailsToggle.querySelector('summary')) : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute('open');

    if (detailsElement === this.mainDetailsToggle) {
      if(isOpen) event.preventDefault();
      isOpen ? this.closeMenuDrawer(summaryElement) : this.openMenuDrawer(summaryElement);
    } else {
      trapFocus(summaryElement.nextElementSibling, detailsElement.querySelector('button'));

      setTimeout(() => {
        detailsElement.classList.add('menu-opening');
      });
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });
    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove('menu-opening');
      this.mainDetailsToggle.querySelectorAll('details').forEach(details =>  {
        details.removeAttribute('open');
        details.classList.remove('menu-opening');
      });
      this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
      document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`);
      removeTrapFocus(elementToFocus);
      this.closeAnimation(this.mainDetailsToggle);
    }
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (this.mainDetailsToggle.hasAttribute('open') && !this.mainDetailsToggle.contains(document.activeElement)) this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest('details');
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    detailsElement.classList.remove('menu-opening');
    removeTrapFocus();
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute('open');
        if (detailsElement.closest('details[open]')) {
          trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
        }
      }
    }

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define('menu-drawer', MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer(summaryElement) {
    this.header = this.header || document.getElementById('shopify-section-header');
    this.borderOffset = this.borderOffset || this.closest('.header-wrapper').classList.contains('header-wrapper--border-bottom') ? 1 : 0;
    document.documentElement.style.setProperty('--header-bottom-position', `${parseInt(this.header.getBoundingClientRect().bottom - this.borderOffset)}px`);

    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });

    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
}

customElements.define('header-drawer', HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      'click',
      this.hide.bind(this)
    );
    this.addEventListener('click', (event) => {
      if (event.target.nodeName === 'MODAL-DIALOG') this.hide();
    });
    this.addEventListener('keyup', () => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
  }

  show(opener) {
    this.openedBy = opener;
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
    this.querySelector('.template-popup')?.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    this.removeAttribute('open');
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define('modal-dialog', ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');
    button?.addEventListener('click', () => {
      document.querySelector(this.getAttribute('data-modal'))?.show(button);
    });
  }
}
customElements.define('modal-opener', ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="Deferred-Poster-"]')?.addEventListener('click', this.loadContent.bind(this));
  }

  loadContent() {
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));

      this.setAttribute('loaded', true);
      window.pauseAllMedia();
      this.appendChild(content.querySelector('video, model-viewer, iframe')).focus();
    }
  }
}

customElements.define('deferred-media', DeferredMedia);



class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('ul');
    this.sliderItems = this.querySelectorAll('li');
    this.pageCount = this.querySelector('.slider-counter--current');
    this.pageTotal = this.querySelector('.slider-counter--total');
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    if (!this.slider || !this.nextButton) return;

    const resizeObserver = new ResizeObserver(entries => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener('scroll', this.update.bind(this));
    this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
  }

  initPages() {
    if (!this.sliderItems.length === 0) return;
    this.slidesPerPage = Math.floor(this.slider.clientWidth / this.sliderItems[0].clientWidth);
    this.totalPages = this.sliderItems.length - this.slidesPerPage + 1;
    this.update();
  }

  update() {
    if (!this.pageCount || !this.pageTotal) return;
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderItems[0].clientWidth) + 1;

    if (this.currentPage === 1) {
      this.prevButton.setAttribute('disabled', true);
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (this.currentPage === this.totalPages) {
      this.nextButton.setAttribute('disabled', true);
    } else {
      this.nextButton.removeAttribute('disabled');
    }

    this.pageCount.textContent = this.currentPage;
    this.pageTotal.textContent = this.totalPages;
  }

  onButtonClick(event) {
    event.preventDefault();
    const slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + this.sliderItems[0].clientWidth : this.slider.scrollLeft - this.sliderItems[0].clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition
    });
  }
}

customElements.define('slider-component', SliderComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
    this.updateCrossout();
  }

  updateCrossout()
  {

    const productId = this.parentElement.dataset.productid;
    console.log(productId);
    this.updateOptions();
    this.updateMasterId();
    console.log(this.currentVariant);
    // console.log(this.currentVariant.available);
    // console.log(this.parentElement.querySelector('.product-form__input input[type="radio"]:checked+label'));
    
    this.parentElement.querySelectorAll('.product-form__input input[type="radio"]+label').forEach(function(userItem) {
      userItem.classList.remove("crossout");
    });
    // if(this.currentVariant.available===false)
    // {
      if(document.querySelectorAll('.product-form__input.color-swatches input[type="radio"]').length > 0){
        if(document.querySelector('.product-form__input.color-swatches input[type="radio"]:checked').value==this.currentVariant.option2)
        {
          $(this.getVariantData()).each(function(index,item) {
            // console.log('musaddiqa');
            // console.log(item);
            if(!item.available && document.querySelector('.product-form__input.color-swatches input[type="radio"]').value==item.option2)
            {
              let size=item.option1;
              // console.log(size);
              // console.log(document.querySelector('.product-form__input input[type="radio"][value="'+size+'"]'));
              document.querySelector('.product-form__input input[type="radio"][value="'+item.option1+'"]+label').classList.add("crossout");
              //  this.parentElement.querySelector('.product-form__input input[type="radio"]:checked+label').classList.add("crossout");
            }
          });
          
        }
      }
    // }
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.updateInventoryNotice();
    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
    }
  }
  updateInventoryNotice() {
    const inventoryElement = this.parentElement.querySelector('.product__inventory'); 
    const availableDateElement = this.parentElement.querySelector('.availableDate'); 
    const inventoryCountElement = inventoryElement.querySelector('.count');
    const thresHold = inventoryElement.dataset.inventory_threshold; 
    const productId = this.parentElement.dataset.productid;
    const currentVariant = this.currentVariant.id;
    var variantInventoryObject = window.variants[productId][currentVariant];
    console.log(variantInventoryObject);
    console.log(this.currentVariant);
    if(variantInventoryObject !== undefined){
      
      /* cross out function call*/
      this.updateCrossout();
          /* cross out function call*/
      // console.log(this.currentVariant.available);
      // console.log(this.parentElement.querySelector('.product-form__input input[type="radio"]:checked+label'));
      
      // this.parentElement.querySelectorAll('.product-form__input input[type="radio"]+label').forEach(function(userItem) {
      //   userItem.classList.remove("crossout");
      // });
      // if(this.currentVariant.available===false)
      // {
      //   this.parentElement.querySelector('.product-form__input input[type="radio"]:checked+label').classList.add("crossout");
      // }
        // console.log('this:',productId, 'currentVariant:',currentVariant);
        
      inventoryCountElement.innerHTML = variantInventoryObject.quantity;
      if ( variantInventoryObject.quantity == 0 && this.currentVariant.inventory_policy == 'continue') {
      // Availability & msg hide
      } else if(this.currentVariant.inventory_management == 'shopify'){
        if (variantInventoryObject.quantity > 0) {
          if (variantInventoryObject.quantity < thresHold) {
            // console.log('Low stock', variantInventoryObject.quantity);
            inventoryElement.classList.remove('hidden');
          } else {
            // console.log('Full stock', variantInventoryObject.quantity);
            inventoryElement.classList.add('hidden');
          }
        } else {
          // console.log('Sold Out', variantInventoryObject.quantity);
          inventoryElement.classList.add('hidden');
        }
        if(variantInventoryObject.quantity == 0 && variantInventoryObject.incoming == true){
          availableDateElement.innerHTML = variantInventoryObject.next_incoming_date;
        } else {
          availableDateElement.innerHTML = '';
        }
      }
      // inventoryElement
    }
  }
  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
    console.log(this.options);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant || !this.currentVariant?.featured_media) return;
    const newMedia = document.querySelector(
      `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
    );
    const lowerMedia = document.querySelector(
      `[data-media-slick-id="${this.currentVariant.featured_media.id}"]`
    );
    if (!newMedia) return;
    const parent = newMedia.parentElement;
    // parent.prepend(newMedia);
    window.setTimeout(() => { parent.scroll(0, 0) ;      
      if(lowerMedia)
        $('.thumb').slick('slickGoTo', parseInt(parseInt(lowerMedia.getAttribute('data-slide-number'))-1));
    });
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant?.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;

        document.getElementById(`price-${this.dataset.section}`)?.classList.remove('visibility-hidden');
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', true);
      if (text) addButton.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButton.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const addButton = document.getElementById(`product-form-${this.dataset.section}`)?.querySelector('[name="add"]');
    if (!addButton) return;
    addButton.textContent = window.variantStrings.unavailable;
    document.getElementById(`price-${this.dataset.section}`)?.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
  
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }
  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
    });
    $(fieldsets).each(function(index) {
      // console.log(this);
      var selectedOption = $(this).find('input:checked').val();
      // console.log(selectedOption);
      $(this).find('.form__label b').text(selectedOption).removeClass('hidden');
    });
  }
}
customElements.define('variant-radios', VariantRadios);

class productInfo extends HTMLElement {
  constructor() {
    super();
    this.variantSwatches();
  }
  variantSwatches() {
    var variantInfo = $(this).find('fieldset legend');
    var productId = this.dataset.productid;
    $(this.getVariantData()).each(function(index) {
      var thisVariant = this;
      // console.log(thisVariant);
      variantInfo.each(function(index) {
        index = index + 1;
        // console.log($(this));
        var thisName = $(this).data('option').toLowerCase();
        if(thisName == 'color'){
          var thisElement = $(this);
          if(index == 1){
            var colorOption = thisVariant.option1;
          } else if (index == 2){
            var colorOption = thisVariant.option2;
          } else if (index == 3){
            var colorOption = thisVariant.option3;
          }
          if(colorOption){
            var variantInventoryObject = $(this).closest('.product__info-container').find('.js-product-inventory-data').find('.js-variant-inventory-data#'+thisVariant.id);
            if(variantInventoryObject.length > 0){
              // console.log('Product Inventory', variantInventoryObject[0].dataset);
              // console.log(variantInventoryObject);
              var colorHax = variantInventoryObject[0].dataset.color;
            if(colorHax){
              // console.log(colorHax);
              thisElement.siblings('label[data-color="'+colorOption+'"]').css('background-color',colorHax);
              thisElement.siblings('label[data-color="'+colorOption+'"]').find('span').addClass('visibility-hidden')
            }
            var color_swatche = variantInventoryObject[0].dataset.color_swatche;
            if(color_swatche){
              // console.log(thisElement.siblings('label[data-color="'+colorOption+'"]').length);
              thisElement.siblings('label[data-color="'+colorOption+'"]').css('background-image','url('+color_swatche+')');
              thisElement.siblings('label[data-color="'+colorOption+'"]').find('span').addClass('visibility-hidden')
              // console.log(color_swatche);
            }
            }
          }
        }
      });
    });
  }
  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}
customElements.define('product-info', productInfo);

// Start Product Grid Color Swap 
var selectors = {
  colorSwatchImage: '.grid-product__color-image',
  colorSwatch: '.color-swatch--with-image'
};
$(document).on({
  mouseenter: function (evt) {
      //stuff to do on mouse enter
      $el = $(evt.currentTarget);
      var id = $el.data('variant-id');
      var image = $el.data('variant-image');
      $($el).closest('.card-wrapper').find('.grid-product__color-image--' + id).css('background-image', 'url(' + image + ')').addClass('is-active');
      console.log('this',$($el).closest('.card-wrapper').find('.grid-product__color-image--' + id));
      // console.log('this',$el);
    },
    mouseleave: function (evt) {
      //stuff to do on mouse leave
      $el = $(evt.currentTarget);
      var id = $el.data('variant-id');
      $($el).closest('.card-wrapper').find('.grid-product__color-image--' + id).removeClass('is-active');
      // console.log('that',$el);
  }
}, selectors.colorSwatch); //pass the element as an argument to .on

// End Product Grid Color Swap
// shopify-section 

 // Start Product Thumbnail Hover Video
 if($('.card-wrapper').length) {
  var productItem = '.card-wrapper';
  var producthoverVideoWrapper = '.video__container';
  var hoverVideo = '.hover_video';

  $(document).on('mouseenter',productItem,function() {
    if($(this).find(hoverVideo).length) {
      var me = $(this);
      var myVideo = $(this).find(hoverVideo);
      var myWrapper = $(this).find(producthoverVideoWrapper);
      var videoFile = myVideo.find('source').data('src');
      var myPreloader = me.find('.video-preloader');

      myWrapper.stop().fadeIn('fast');

      if(!myVideo.hasClass('video-loaded')) {
      //   $(myVideo).mouseenter(function () {
      //     $(this).get(0).play();
      // }).mouseleave(function () {
      //     $(this).get(0).pause();
      // })
        //myPreloader.fadeIn('fast');
        myVideo.find('source').attr('src',videoFile);
        //myVideo.get(0).load();

        myVideo.get(0).onplaying = function() {
          myPreloader.removeClass('loading');
          myVideo.addClass('video-loaded');
        };
        myWrapper.stop().fadeIn();
        //myVideo.get(0).load();
        myVideo.get(0).play();
      } else {
        if(myVideo.get(0).readyState === 4) {
          myPreloader.removeClass('loading');
          myVideo.stop().fadeIn();
          //myVideo.get(0).load();
          myVideo.get(0).play();
        }
      }
    }
  });

  $(document).on('mouseleave',productItem,function() {
    if($(this).find(hoverVideo).length) {
      var myVideo = $(this).find(hoverVideo);
      var myWrapper = $(this).find(producthoverVideoWrapper);
      if(myVideo[0].readyState === 4) {
        myVideo[0].pause();
      }
      myWrapper.stop().fadeOut();
    }
  });
}
// End Product Thumbnail Hover Video

// Start Video Section HTML5 Video Play Push Button
$('#banner-video').parent().click(function () {
  if($(this).children("#banner-video").get(0).paused){        
    $(this).children("#banner-video").get(0).play();   
    $(this).children(".playpause").fadeOut();
    }
    else
    {       
      $(this).children("#banner-video").get(0).pause();
      $(this).children(".playpause").fadeIn();
    }
});
// End Video Section HTML5 Video Play Push Button
// Start Video Section HTML5 Slideshow Video Play Push Button
$('#banner-videos').parent().click(function () {
  if($(this).children("#banner-videos").get(0).paused){        
    $(this).children("#banner-videos").get(0).play();   
    $(this).children(".playpause").fadeOut();
    }
    else
    {       
      $(this).children("#banner-videos").get(0).pause();
      $(this).children(".playpause").fadeIn();
    }
});
// End Video Section HTML5 Slideshow Video Play Push Button


