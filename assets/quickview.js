//Quick View

$(document).ready(function () {
  quickView();
});

function quickView() {
  $(document).on("click", ".quick-view", function () {
    if ($('#quick-view').length == 0) { $("body").append('<div id="quick-view">'+content+'</div>'); }
    var qCProduct = $(this).closest('.card-wrapper').find('.card.card--product').data('product');
    var product_handle = $(this).data('handle');
    var productForm = `<product-card-form class="product-form">
    <form method="post" action="/cart/add" accept-charset="UTF-8" class="form" enctype="multipart/form-data" novalidate="novalidate" data-type="add-to-cart-form">
    <input type="hidden" name="form_type" value="product" tabindex="0">
    <input type="hidden" name="utf8" value="✓" tabindex="0">
    <div class="select hidden"><select name="id"></select></div>
    <div class="product-form__buttons">
    <button type="submit" name="add" class="product-form__submit button button--full-width button--secondary" tabindex="0">Add to cart
    </button>
    </div>
    </form></product-card-form>`;
    // console.log(productForm);
    $('#quick-view').addClass(product_handle);

    jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
      var product_id = product.id;
      // console.log(product_id);
      var title = product.title;
      var handle = product.handle;
      var type = product.type;
      var price = 0;
      var original_price = 0;
      var desc = product.description.replace(/(<([^>]+)>)/ig, "");
      var desc = desc.replace(/\[countdown\](.*)\[\/countdown\]/g, "");
      desc = desc.split(" ").splice(0, 25).join(" ") + "...";
      var images = product.images;
      const variants = product.variants;
      var options = product.options;
      var url = '/products/' + product_handle;
      $('#quick-view .qv-product-title').text(title);
      $('#quick-view .qv-product-type').text(type);
      $('#quick-view .qv-product-description').html(desc);
      $('#quick-view .product-form__button').html(productForm);

      $('#quick-view .view-product').attr('href', url);

      $('#quick-view .product_form').attr('data-product', JSON.stringify(product));
      $('#quick-view .product__main').addClass('product-'+product_id);
      $('#quick-view .product_form').attr('data-product-id', product_id);
      $('.product-single__meta').attr('data-limoniapps-discountninja-product-handle', handle);
      var imageCount = product.media.length;
      var aspectratio = $('#quick-view .sliderWrap').data('aspectratio');
      // console.log('aspectratio: '+aspectratio);

      var variantsOption = '';
      $(product.variants).each(function (i, variant) {
        // if(variant.id == availableVariants){} else {}
        variantsOption += `<option value="${variant.id}">${variant.title} - ${Shopify.formatMoney(variant.price)}</option>`;
      });
      $('#quick-view').find('.select select').attr('id','product-select-'+product.id).append(variantsOption);

      $(product.media).each(function (i, image) {
        var image_alt = '';
        if (image.alt != null) {
          image_alt = image.alt.replace(title, "");
        } else {
          image_alt = title + '-' + i;
        }
        image_alt = image_alt.replace(/\s+/g, '-').toLowerCase();



        var imgSize = 1 / image.aspect_ratio;
        var aspectratioSize = imgSize * 100;
        var imgId = this.id;
        console.log('aspectratio: '+image.aspect_ratio);
        console.log('aspectratioSize: '+aspectratioSize+'%');

        if (imageCount == 1) {

          if(image.media_type==='video')
          {
             // Single Video
            // Main Video
            var image_embed = '<div><div class="thumbWrap"><div class="fixed_aspect_ratio image-ratio" style="padding-top: '+aspectratioSize+'%;"><video class="embed-item" controls><source src="'+image.sources[0].url+'" type="video/mp4"></video></div></div></div>';
            image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
            $('#quick-view .qv-product-images').append(image_embed);

            // Thumb Images
            var image_thumb = '<div class="thumb-iteam" data-target="' + imgId + '" ><div class="thumbWrap"><div class="fixed_aspect_ratio image-ratio" style="padding-top: '+aspectratioSize+'%;"><img class="embed-item" id="imgid-' + imgId + '"  src="' + image.preview_image.src + '" alt="' + image_alt + '"><div class="product-single__thumbnail-badge"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--full-color icon-video-badge-full-color" viewBox="0 0 26 26"><path clip-rule="evenodd" d="M1 25h24V1H1v24z"></path><path class="icon-video-badge-full-color-outline" d="M.5 25v.5h25V.5H.5V25z"></path><path class="icon-video-badge-full-color-element" clip-rule="evenodd" d="M9.718 6.72a1 1 0 0 0-1.518.855v10.736a1 1 0 0 0 1.562.827l8.35-5.677a1 1 0 0 0-.044-1.682l-8.35-5.06z" opacity=".6"></path></svg></div></div></div></div>';
            image_thumb = image_thumb.replace('.jpg', '_100x.jpg').replace('.png', '_100x.png');
            $('#quick-view .qv-product-thumb-images').append(image_thumb);
          }
          else
          {

            // Single Images
            // Main Images
            var image_embed = '<div><div class="thumbWrap"><div class="fixed_aspect_ratio image-ratio" style="padding-top: '+aspectratioSize+'%;"><img class="embed-item" src="' + image.src + '" alt="' + image_alt + '"></div></div></div>';
            image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
            $('#quick-view .qv-product-images').append(image_embed);

            // Thumb Images
            var image_thumb = '<div class="thumb-iteam" data-target="' + imgId + '" ><div class="thumbWrap"><div class="fixed_aspect_ratio image-ratio" style="padding-top: '+aspectratioSize+'%;"><img class="embed-item" id="imgid-' + imgId + '"  src="' + image.src + '" alt="' + image_alt + '"></div></div></div>';
            image_thumb = image_thumb.replace('.jpg', '_100x.jpg').replace('.png', '_100x.png');
            $('#quick-view .qv-product-thumb-images').append(image_thumb);
          }

        } else {
          // Multiple Images
          if(image.media_type==='video')
          {

            // Main Video
            var image_embed = '<div><div class="thumbWrap"><div class="fixed_aspect_ratio image-ratio"><video class="embed-item" controls><source src="'+image.sources[0].url+'" type="video/mp4"></video></div></div></div>';
            image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
            $('#quick-view .qv-product-images').append(image_embed);

            // Thumb Images
            var image_thumb = '<div class="thumb-iteam" data-target="' + imgId + '" ><div class="thumbWrap"><div class="fixed_aspect_ratio image-ratio" style="padding-top: '+aspectratioSize+'%;"><img class="embed-item" id="imgid-' + imgId + '"  src="' + image.preview_image.src + '" alt="' + image_alt + '"><div class="product-single__thumbnail-badge"><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon--full-color icon-video-badge-full-color" viewBox="0 0 26 26"><path clip-rule="evenodd" d="M1 25h24V1H1v24z"></path><path class="icon-video-badge-full-color-outline" d="M.5 25v.5h25V.5H.5V25z"></path><path class="icon-video-badge-full-color-element" clip-rule="evenodd" d="M9.718 6.72a1 1 0 0 0-1.518.855v10.736a1 1 0 0 0 1.562.827l8.35-5.677a1 1 0 0 0-.044-1.682l-8.35-5.06z" opacity=".6"></path></svg></div></div></div></div>';
            image_thumb = image_thumb.replace('.jpg', '_100x.jpg').replace('.png', '_100x.png');
            $('#quick-view .qv-product-thumb-images').append(image_thumb);
          }
          else
          {

            // Main Images
            var image_embed = '<div><div class="thumbWrap"><div class="fixed_aspect_ratio image-ratio" style="padding-top: '+aspectratioSize+'%;"><img class="embed-item" src="' + image.src + '" alt="' + image_alt + '"></div></div></div>';
            image_embed = image_embed.replace('.jpg', '_800x.jpg').replace('.png', '_800x.png');
            $('#quick-view .qv-product-images').append(image_embed);

            // Thumb Images
            var image_thumb = '<div class="thumb-iteam" data-target="' + imgId + '" ><div class="thumbWrap"><div class="fixed_aspect_ratio image-ratio" style="padding-top: '+aspectratioSize+'%;"><img class="embed-item" id="imgid-' + imgId + '"  src="' + image.src + '" alt="' + image_alt + '"></div></div></div>';
            image_thumb = image_thumb.replace('.jpg', '_100x.jpg').replace('.png', '_100x.png');
            $('#quick-view .qv-product-thumb-images').append(image_thumb);
          }
        }
      }).promise().done(function () {
        if (imageCount > 0) {
          destroyCarousel();
          slickInit();
        }
      });
      $(options).each(function (i, option) {
        var opt = option.name;
            var selectClass = '.option.' + opt.toLowerCase();
            var variantSwatch = $('#quick-view .qv-product-options').data('variant-swatch');
            var variantSwatchImg = $('#quick-view .qv-product-options').data('variant-swatchimg');
            var swtchWrap = '';
            var optionHide = '';
            var defultOption = '';
            if (opt == 'Title'){
                var defultOption = ' hidden';
            }
            if (variantSwatch == true){
              var optionHide = ' hidden';
              var swtchWrap = '<div data-option-index="'+i+'" class="option-selection swatch option-selection-swatches option-selection-' + opt.toLowerCase() + '-swatches'+ defultOption +'" data-option="'+opt.toLowerCase()+'"><div class="optionTitleWrap"><span class="option">' + opt + ':</span></div></div>';

              var swtchWrap = `<div data-option-index="${i}" class="option-selection swatch option-selection-swatches option-selection-${opt.toLowerCase()}-swatches ${defultOption}" data-option="${opt.toLowerCase()}"><div class="optionTitleWrap"><span class="option">${opt}:</span>${opt.toLowerCase() == 'size' ? '<a href="/pages/size-guide">Size chart</a>' : ''}</div></div>`;

            }
            $('#quick-view .qv-product-options .swatch_options').append(swtchWrap);
            $('#quick-view .qv-product-options .product-form__controls-group').append('<div class="option-selection option-selection-' + opt.toLowerCase() + optionHide + defultOption +'" data-option="'+opt.toLowerCase()+'"><span class="option">' + opt + ':</span><div class="select"><select class="single-option-selector option-' + i + ' option ' + opt.toLowerCase() + ' select__select"></select><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path></svg></div></div>');




        
        $(option.values).each(function (i, value) {
          // Color swatched hack
          var select_option = '';
          var swatch_img_name = '';
          var swatchStyle = '';
          if (i == 0) { select_option = "checked='checked'"; }
          if (option.name == 'Color') {
            var swatch_img_name = value;
            swatch_img_name = swatch_img_name.toLowerCase();
            swatch_img_name = swatch_img_name.replace(" ", "");
            swatch_Color = swatch_img_name;
            // console.log(swatch_Color);
            swatch_img_name = 'https://cdn.shopify.com/s/files/1/0271/0224/9041/t/7/assets/' + swatch_img_name + '.png';
            // console.log(swatch_img_name);
            if(variantSwatchImg == 'true'){
              var swatchStyle = 'style="background-color: ' + swatch_Color + ';background-image:url(' + swatch_img_name + ');"';
            } else{
              var swatchStyle = 'style="background-color: ' + swatch_Color + ';"';
            }
          }
          var valueName = value;
          $('#quick-view .option-selection-' + opt.toLowerCase() + '-swatches')
          .append('<div class="product-single__swatch__item swatch-element swatches__item" value="'+value+'" data-value="'+value+'"><input type="radio" ' + select_option + ' class="product-single__swatch__input u-hidden-visually" id="' + value + '" name="' + opt + '" value="' + value + '" /><label for="' + value + '" data-'+opt+'="'+ value + '" class="product-single__swatch__label"><span class="product-single__swatch__label__graphic" ' + swatchStyle + '>' + valueName + '</span></label></div>');
          $('#quick-view .option.' + opt.toLowerCase()).append('<option value="' + value + '">' + value + '</option>');
        });
      });
      for (let i = 0; i < variants.length; i++) {
      if (variants[i].available == true) {
        $(i).addClass("available");
      } else {
      $(i).addClass("sold-out");
      }
      }
      $(product.variants).each(function (i, v) {
         //console.log('this', v);
        // console.log('this', window.variants[product.id][v.id]);
        updateInventoryNotice(v,product);
        if (v.available == true) {
          $('#quick-view .qv-add-button').prop('disabled', false).find('[data-add-to-cart-text]').text(window.variantStrings.addToCart);
        } else {
          $('#quick-view .qv-add-button').prop('disabled', true).find('[data-add-to-cart-text]').text(window.variantStrings.soldOut);
          // $('.swatch_options .product-single__swatch__item').addClass('sold-out');
        }

        if (v.inventory_quantity == 0) {
          $('#quick-view .qv-add-button').prop('disabled', true).val(window.variantStrings.soldOut);
          $('#quick-view .qv-add-to-cart').hide();
          $('#quick-view .qv-product-price').text(window.variantStrings.soldOut).show();
          return true
        } else {
          price = parseFloat(v.price / 100).toFixed(2);
          original_price = parseFloat(v.compare_at_price / 100).toFixed(2);

          // console.log('price: '+ Shopify.formatMoney(v.price)+', Orignal Price: '+ Shopify.formatMoney(v.compare_at_price));
          if (v.available == false) {
            $('#quick-view .product__price .price__regular .price-item--regular').text(Shopify.formatMoney(price));
            $('#quick-view .product__price .price').removeClass('price--on-sale');
            $('#quick-view .product__price .price').addClass('price--sold-out ');
            $('#quick-view .product__price .badge').remove();
            $('#quick-view .product__price .price').append('<span class="badge price__badge-sold-out color-inverse" aria-hidden="true">Sold out</span>');
            //console.log('sold')
          } else if (v.compare_at_price > v.price) {
            $('#quick-view .product__price .price__sale .price-item--sale').text(Shopify.formatMoney(price));
            $('#quick-view .product__price .price__sale .price-item--regular').text(Shopify.formatMoney(original_price));
            $('#quick-view .product__price .price').addClass('price--on-sale');
            $('#quick-view .product__price .price').removeClass('price--sold-out ');
            $('#quick-view .product__price .badge').remove();
            $('#quick-view .product__price .price').append('<span class="badge price__badge-sale color-accent-2" aria-hidden="true">Sale</span>');
            // console.log('sale');
          } else if (v.compare_at_price == null || v.compare_at_price < v.price) {
            $('#quick-view .product__price .price__regular .price-item--regular').text(Shopify.formatMoney(price));
            $('#quick-view .product__price .price').removeClass('price--on-sale');
            $('#quick-view .product__price .price').removeClass('price--sold-out ');
            $('#quick-view .product__price .badge').remove();
            console.log('Null & no sale');
            // console.log('Null');
          }

          $('#quick-view select.option-0').val(v.option1);
          $('#quick-view select.option-1').val(v.option2);
          $('#quick-view select.option-2').val(v.option3);
          return false
        }
      });
      // console.log('test',variants);
      var variantInfo = $('#quick-view').find('.swatch_options .option-selection.swatch');
      var productId = product.id;
      $(variants).each(function(index) {
        // Sold Out variant sold out class add
        //console.log($(this));
        var currentOption = $(this);
        var currenOptionName = currentOption[0].option1;
        var availibility;
        if (currentOption[0].available == true) {
          availibility = "available";
        }else {
          availibility = "sold-out";
        }
        $(".qv-product-options .product-single__swatch__item").each(function () {
        var optionName = $(this).attr("value");
        if (optionName == currenOptionName) {
          $(this).addClass(availibility);
        }
        });
        // Sold Out variant sold out class add
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
              const variantInventorys = document.querySelectorAll('.js-product-inventory-data[data-product-id="'+productId+'"] .js-variant-inventory-data[id="'+thisVariant.id+'"]');
              variantInventorys.forEach((variantInventory) => {
                // console.log(variantInventory.dataset);
                var colorHax = variantInventory.dataset.color;
                if(colorHax){
                  thisElement.find('label[data-color="'+colorOption+'"]').css('background-color',colorHax);
                  thisElement.find('label[data-color="'+colorOption+'"]').find('span').addClass('visibility-hidden')
                }
                var color_swatche = variantInventory.dataset.color_swatche;
                if(color_swatche){
                  // console.log(thisElement.find('label[data-color="'+colorOption+'"]').length);
                  thisElement.find('label[data-color="'+colorOption+'"]').css('background-image','url('+color_swatche+')');
                  thisElement.find('label[data-color="'+colorOption+'"]').find('span').addClass('visibility-hidden')
                  // console.log(color_swatche);
                }
              });
            }
          }
        });
      });
    }).done(function() {
      // console.log( "second success" );
      init();
    });
    $(document).on("click", "#quick-view .product-single__swatch__item input[type=radio]", function () {
      var value = $(this).val(),
      index = $(this).closest('.swatch').data('option-index'),
      targetSelect = $(this).closest('.qv-product-options').find('.product-form__controls-group .option-selection:eq('+index+')').find('select');

      if (value != '') {
        // console.log(value, this);
        $(targetSelect).val(value).change();
      }
      // console.log(this);
      // targetLabel = $(this).closest('.option-selection-color-swatches').find('.option b');
    });
    $(document).on("change", "#quick-view .option-selection select", function () {
      var selectedOptions = '';
      $('#quick-view .option-selection select').each(function (i) {
        if (selectedOptions == '') {
          selectedOptions = $(this).val();
        } else {
          selectedOptions = selectedOptions + ' / ' + $(this).val();
        }
        // MKT added image selection hack
        var selectedOptions_new = selectedOptions.toLowerCase();
        var image_index = $('img[alt="' + selectedOptions_new + '"]').parent().attr('data-slick-index');
        if (image_index != undefined) {
          $('.qv-product-images').slick("goTo", image_index);
        }
        // MKT added image selection hack
      });
      var product = $('#quick-view .product_form').data('product');
      var productVariants = product.variants;
      // console.log('variants', productVariants);
      // console.log($('#quick-view .product_form').data('product'));
      // jQuery.getJSON('/products/' + product_handle + '.js', function (product) {
        // $(product.variants).each(function (i, v) {
        $(productVariants).each(function (i, v) {
          // console.log('test',v);
          if (v.title == selectedOptions) {
            // console.log('that');
            // console.log(v.id);
            $('#quick-view .product-form select').val(v.id).change();
            updateInventoryNotice(v,product);
            var price = parseFloat(v.price / 100).toFixed(2);
            var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
            var v_qty = v.inventory_quantity;
            var v_inv = v.inventory_management;
            if(v.featured_media !== 'undefined' || v.featured_media !== null){
              // console.log(v.featured_media.id);
              var targetImg = $('.qv-product-thumb-images  #imgid-' + v.featured_media.id).closest('.thumb-iteam').data('slick-index');
              if (targetImg != undefined) {
                $('.qv-product-thumb-images').slick("goTo", targetImg);
              }
            } else {
              // console.log(v.featured_media);
            }
            if (v.available == false) {
              // console.log("hi");
              $('content .product__price .price__regular .price-item--regular').text(Shopify.formatMoney(price));
              $('content .product__price .price').removeClass('price--on-sale');
              $('content .product__price .price').addClass('price--sold-out ');
              $('content .product__price .badge').remove();
              $('content .product__price .price').append('<span class="badge price__badge-sold-out color-inverse" aria-hidden="true">Sold out</span>');
              // $('.qv-add-button').prop('disabled', true).find('[data-add-to-cart-text]').text(window.variantStrings.soldOut);
              
               //console.log('sold')
            } else if (v.compare_at_price > v.price) {
              $('content .product__price .price__sale .price-item--sale').text(Shopify.formatMoney(price));
              $('content .product__price .price__sale .price-item--regular').text(Shopify.formatMoney(original_price));
              $('content .product__price .price').addClass('price--on-sale');
              $('content .product__price .price').removeClass('price--sold-out ');
              $('content .product__price .badge').remove();
              $('content .product__price .price').append('<span class="badge price__badge-sale color-accent-2" aria-hidden="true">Sale</span>');
              // console.log('sale');
            } else if (v.compare_at_price == null || v.compare_at_price < v.price) {
              $('content .product__price .price__regular .price-item--regular').text(Shopify.formatMoney(price));
              $('content .product__price .price').removeClass('price--on-sale');
              $('content .product__price .price').removeClass('price--sold-out ');
              $('content .product__price .badge').remove();
              // console.log('Null & no sale');
              // console.log('Null');
            }
            if (v.available == true) {
              $('#quick-view .product-form form .product-form__buttons .product-form__submit').prop('disabled', false).text(window.variantStrings.addToCart);
            } else {
              $('#quick-view .product-form form .product-form__buttons .product-form__submit').prop('disabled', true).text(window.variantStrings.soldOut);
            }
          }
        });
      // });
    });

    // var content = $('#quick-view').html();
    function init() {
      // initialisation stuff here
      $.fancybox.open($('#quick-view'), {
        baseClass: 'quick-shop__lightbox fancybox-quick-view',
        // slideClass: "fancybox-quick-view-slide",
        animationEffect: "fade",
        animationDuration: 300,
        touch: false,
        hash: false,
        infobar: false,
        toolbar: false,
        loop: false,
        smallBtn: true,
        mobile: {
          preventCaptionOverlap: false,
          toolbar: true
        },
        onInit: function (instance) {
          // onInit
        },
        beforeShow: function (instance) {
          // beforeShow
        },
        beforeLoad: function (instance) {
          $('#quick-view').addClass('loaded');
          // beforeLoad
        },
        afterLoad: function (instance, current) {
          // afterLoad
          //  console.log('afterLoad')
          // var product_handle = $('#quick-view').attr('class');
          $(document).on("submit", "#quick-view .product-form form", function () {
            var qty = $('#quick-view .qv-quantity').val();
            var selectedOptions = '';
            var var_id = $('#quick-view .product-form select').val();
            processCart();
            function processCart() {
               //console.log('quick-view submit, qty:',qty,'variant id: ',var_id);
              $('#quick-view .product-form form .product-form__buttons .product-form__submit').addClass('loading').prop('disabled', true);
              jQuery.post('/cart/add.js', {
                quantity: qty,
                id: var_id
              },
                null,
                "json"
              ).done(function () {
                $('#quick-view .product-form form .product-form__buttons .product-form__submit').removeClass('loading').prop('disabled', false);
                $('#quick-view .qv-add-to-cart-response').addClass('success').fadeIn().html('<span>' + $('.qv-product-title').text() + ' has been added to your cart. <a href="/cart">Click here to view your cart.</a>');
                fetch('/cart.js', { credentials: 'same-origin' }).then(function(response) {return response.json();}).then(function(cart) {
                  // console.log(cart.item_count);
                  $('.cart-count-bubble span[aria-hidden]').text(cart.item_count),
                    $('.cart-count-bubble span.visually-hidden').text(cart.item_count <= 1 ? cart.item_count+' item' : cart.item_count+' items');
                }).catch(function(error) {console.log(error);});
                setTimeout(function() {
                  $('#quick-view .qv-add-to-cart-response').slideUp();
                }, 3500);
                setTimeout(function() {
                  $('#quick-view .qv-add-to-cart-response').text(null).removeClass('success')
                }, 4000);

              })
                .fail(function ($xhr) {
                  var data = $xhr.responseJSON;
                  $('#quick-view .product-form form .qv-add-button').removeClass('hide').prop('disabled', false);
                    $('#quick-view .qv-add-to-cart-response').addClass('error').html('<span><strong>ERROR: </strong>' + data.description);
                  setTimeout(function() {
                  $('#quick-view .qv-add-to-cart-response').text(null).removeClass('error');
                  $('#quick-view .product-form form .product-form__buttons .product-form__submit').removeClass('loading').prop('disabled', false);
                }, 4000);
                });
            }
            return false;
          });
        },

        afterShow: function (instance) {
          // afterShow
          // console.log('after Show');
          // $('#quick-view').addClass('loaded');
          // destroyCarousel();
          // slickInit();
          slickreset();


        },
        afterClose: function (instance, current) {
          // afterClose
          $('#quick-view').removeClass().html(content);
        }
      });
      // console.log('fancybox.open');
    }
    function destroyCarousel() {
      if ($('#quick-view .product-single__media-group .qv-product-images').hasClass('slick-initialized')) { $(this).slick('destroy'); }
      if ($('#quick-view .product-single__media-group .qv-product-thumb-images').hasClass('slick-initialized')) { $(this).slick('destroy'); }
    }
    function slickreset() {
      $('.qv-product-thumb-images').slick('setPosition');
      setTimeout(function(){
        $('.qv-product-thumb-images').slick('setPosition');
      }, 500);
      // $('#quick-view .product-single__media-group .slick-slider.slick-initialized').slick('setPosition');
    }
    function slickInit() {
      setTimeout(function(){
        $('#quick-view .product-single__media-group .qv-product-images').slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
          fade: true,
          asNavFor: '#quick-view .product-single__media-group .qv-product-thumb-images'
        });
        $('#quick-view .product-single__media-group .qv-product-thumb-images').slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          asNavFor: '#quick-view .product-single__media-group .qv-product-images',
          dots: true,
          infinity: false,
          centerMode: false,
          focusOnSelect: true,
          vertical: true,
          verticalSwiping: true
        });
      }, 50);
      setTimeout(function(){
        $('#quick-view .product-single__media-group .slick-slider').slick('setPosition');
      }, 0);
    }
    function updateInventoryNotice(variant, product) {
      // console.log('updateInventoryNotice', variant);
      // console.log('updateInventoryNotice', product.id, variant.id);
      const inventoryElement = document.querySelector('#quick-view .product__inventory');
      const availableDateElement = document.querySelector('#quick-view .availableDate');
      const inventoryCountElement = inventoryElement.querySelector('#quick-view .count');
      const thresHold = window.variantStrings.inventory_threshold;
      const productId = product.id;
      const currentVariant = variant.id;
      const productInventorys = document.querySelectorAll('#quick-view .js-product-inventory-data');
      if(productInventorys.length > 1){
        productInventorys.forEach((productInventory) => {
          if(productInventory.dataset.productId == product.id){
            const variantInventorys = productInventory.querySelectorAll('#quick-view .js-variant-inventory-data');
            variantInventorys.forEach((variantInventory) => {
              if(variantInventory.id == currentVariant){
                const variantInventoryObject = variantInventory.dataset;
                // console.log(variantInventoryObject);
                inventoryCountElement.innerHTML = variantInventoryObject.quantity;
                inventoryElement.classList.remove('hidden');
                // console.log(inventoryElement,availableDateElement)
                // console.log('this:',productId, 'currentVariant:',currentVariant);
                /*
                X-SMALL / RED / Cotton
                SMALL / RED / Cotton
                X-SMALL / BLACK / Cotton
                */
                if ( variantInventoryObject.quantity == 0 && variant.inventory_policy == 'continue') {
                  // Availability & msg hide
                  } else if(variant.inventory_management == 'shopify'){
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
                    if(variantInventoryObject.quantity < 1 && variantInventoryObject.incoming == 'true'){
                      availableDateElement.innerHTML = variantInventoryObject.next_incoming_date;
                      availableDateElement.classList.remove('hidden');
                    } else {
                      availableDateElement.innerHTML = '';
                      availableDateElement.classList.add('hidden');
                    }
                  }
              }
            });
            // console.log(productInventory.length);
          }
        });
      }
    }
  });


};
$(window).resize(function () {
  if ($('#quick-view').is(':visible')) {
    $('#quick-view .qv-product-images').slick('setPosition');
  }
});

