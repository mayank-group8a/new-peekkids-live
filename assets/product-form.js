if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cartNotification = document.querySelector('cart-notification');
    }

    onSubmitHandler(evt) {
            if (document.querySelectorAll('.product-form-container form[action="/cart/add"] input[name="id"]')[0].value == '') {
                        evt.preventDefault();
                        // alert('Please select a product size')
                        $('.product-form__input.product-form__input_size').after('<span class="ProductForm__Error Alert Alert--error">Please select a product size</span>');
                        setTimeout(function () {
                            $('.product-form__input.product-form__input_size').siblings('.ProductForm__Error').remove();
                        }, 2500);
                    }
      else
      {
      evt.preventDefault();
      this.cartNotification.setActiveElement(document.activeElement);

    const submitButton = this.querySelector('[type="submit"]');

    submitButton.setAttribute('disabled', true);
    submitButton.classList.add('loading');

const body = JSON.stringify({
  ...JSON.parse(serializeForm(this.form)),
  sections: this.cartNotification.getSectionsToRender().map((section) => section.id),
  sections_url: window.location.pathname
});

fetch(`${routes.cart_add_url}`, { ...fetchConfig('javascript'), body })
        .then((response) => response.json())
        .then((parsedState) => {
          this.cartNotification.renderContents(parsedState);
          // document.querySelectorAll('#announcementAdvanced').length
          // Shopify.AnnouncementAdvanced.update();
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('disabled');
        });
      }
    }
  });
}
var $status = $('.pagingInfo');
var $slickElement = $('.main');
$slickElement.on('init reInit afterChange', function (event, slick, currentSlide, nextSlide) {
  //currentSlide is undefined on init -- set it to 0 in this case (currentSlide is 0 based)
  var i = (currentSlide ? currentSlide : 0) + 1;
  $status.text(i + '/' + slick.slideCount);
  // console.log('i:', i + '/' + slick.slideCount);
  setTimeout(function() {
    $('.product__media-list.grid').slick('setPosition');
  }, 05);
});


var settings = { slidesToShow: 1, slidesToScroll: 1, arrows: true,fade: true, dots: true }
let  e1=$('.thumb').data('focus');
console.log(e1);
if(e1===true){ settings = { slidesToShow: 1, slidesToScroll: 1, arrows: true,fade: true, dots: true , asNavFor:'.thumb'}};

$slickElement.slick(settings);

// $('.thumb').slick({
//   slidesToShow: 3,
//   slidesToScroll: 1,
//   asNavFor: '.main',
//   dots: false,
//   Infinity:true,
//   centerMode: false,
//   focusOnSelect: $(this).data('focus'),
//   arrows: true,
//   vertical: true,
//   verticalSwiping: true
// });

var settings1 = { slidesToShow: 3,slidesToScroll: 1,asNavFor: '.main',dots: false,Infinity:false,centerMode: false,focusOnSelect: $('.thumb').data('focus'),arrows: true,vertical: true,verticalSwiping: true,adaptiveHeight: true}
$('.thumb').slick(settings1);

$('.thumb .product-single__thumbnails-item').on('click', function (event) {
  $('.main').slick('slickGoTo', $(this).data('slickIndex'));
  $('.thumb .product-single__thumbnails-item').removeClass('slick-current');
  $(this).addClass('slick-current');
});
