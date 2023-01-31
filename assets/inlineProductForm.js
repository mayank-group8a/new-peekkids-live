/**
 * Javascript-Equal-Height-Responsive-Rows
 * https://github.com/modimayur/jquery-Equal-Height-product-grid/
 * Modi Mayur
 */

 !function(i){"use strict";i.fn.equalHeight=function(){var e=[];return i.each(this,function(t,r){var s,n=i(r),a="border-box"===n.css("box-sizing")||"border-box"===n.css("-moz-box-sizing");s=a?n.innerHeight():n.height(),e.push(s)}),this.css("height",Math.max.apply(window,e)+"px"),this},i.fn.equalHeightGrid=function(e){var t=this.filter(":visible");t.css("height","auto");for(var r=0;r<t.length;r++)if(r%e===0){for(var n=i(t[r]),s=1;e>s;s++)n=n.add(t[r+s]);n.equalHeight()}return this},i.fn.detectGridColumns=function(){var e=0,t=0,r=this.filter(":visible");return r.each(function(r,n){var s=i(n).offset().top;return 0!==e&&s!==e?!1:(t++,void(e=s))}),t};var e=0;i.fn.responsiveEqualHeightGrid=function(){function n(){var i=t.detectGridColumns();t.equalHeightGrid(i)}var t=this,r=".grids_"+e;return t.data("grids-event-namespace",r),i(window).bind("resize"+r+" load"+r,n),n(),e++,this},i.fn.responsiveEqualHeightGridDestroy=function(){var e=this;return e.css("height","10"),i(window).unbind(e.data("grids-event-namespace")),this}}(window.jQuery);

$(document).ready(function () {
  inlineFormOptions();
});
function getEqualHeightGrid() {
//   $('.boost-pfs-filter-product-item-grid').responsiveEqualHeightGrid();
//   $('.boost-pfs-filter-product-item-grid .boost-pfs-filter-product-item-image').responsiveEqualHeightGrid();
// //   $('.boost-pfs-filter-product-item-grid .boost-pfs-filter-product-bottom').responsiveEqualHeightGrid();
// //   $('.boost-pfs-filter-product-item-grid .boost-pfs-filter-product-bottom .boost-pfs-filter-product-bottom-inner').responsiveEqualHeightGrid();
  $('.boost-pfs-filter-product-item-grid .boost-pfs-filter-product-bottom .boost-pfs-filter-product-item-title').responsiveEqualHeightGrid();
// //   $('.boost-pfs-filter-product-item-grid .boost-pfs-filter-product-bottom .boost-pfs-filter-product-item-price').responsiveEqualHeightGrid();
//   $('.card-information__wrapper .card-information__text').responsiveEqualHeightGrid();
//   $('.card-information__wrapper .price.price--center').responsiveEqualHeightGrid();
}
$(window).on('load resize ready', function() {
  getEqualHeightGrid();
  setTimeout(function(){
      getEqualHeightGrid();
  }, 1000);
  setTimeout(function(){
      getEqualHeightGrid();
  }, 2000);
  setTimeout(function(){
      getEqualHeightGrid();
  }, 3000);
  setTimeout(function(){
      getEqualHeightGrid();
  }, 4000);
  setTimeout(function(){
      getEqualHeightGrid();
  }, 5000);
});
function inlineFormOptions() {
  getEqualHeightGrid();
  // console.log('this');
  var inlineFormOptionsEL = $(".inline-form-options");
  // console.log(inlineFormOptionsEL.length);
  if (inlineFormOptionsEL.length > 0) {
    inlineFormOptionsEL.each(function (thisEl) {
      var inlineFormWrap = $(this).closest('.inline-form-wrap');
      var inlineFormOptionsEL = $(inlineFormWrap).find('.inline-form-options');
      inlineFormOptionsEL.html('');
      inlineFormOptionsEL.html(`<div class="ipo-add-to-cart product-single"><div class="product_form"><form method="post" action="/cart/add" accept-charset="UTF-8" class="product-form product-form-product-template" enctype="multipart/form-data" novalidate="novalidate" data-product-form=""><input type="hidden" name="form_type" value="product"><input type="hidden" name="utf8" value="✓"><fieldset><div class="quantity" style="display: none"><label><span>Quantity</span><input type="number" class="ipo-quantity" value="1" min="1"></label></div><div class="select hidden"><select name="id"></select></div><div class="product-form__controls-group swatch_options"><div class="ipo-product-options" data-variant-swatch="true" data-variant-swatchimg="true"><div class="swatch_options"></div><div class="product-form__controls-group"></div><button type="submit" name="add" aria-label="Add to cart" class="btn ipo-add-button"><span data-add-to-cart-text="">Add to cart</span></button></div></div><div class="product__availability" style="display: none;"></div><div class="ipo-add-to-cart-response"></div></fieldset></form></div></div>`);
      // console.log(quickATC);
      var product = JSON.parse(inlineFormWrap.find('.product-script').html());
      // console.log(product);
      var price = 0;
      var original_price = 0;
      const variants = product.variants;
      if (product.options_with_values !== undefined) {
        var options = product.options_with_values;
      } else {
        var options = JSON.parse(inlineFormWrap.find('.product-options-with-values-script').html());
      }
      var variantsOption = '';
      $(product.variants).each(function (i, variant) {
        // if(variant.id == availableVariants){} else {}
        variantsOption += `<option value="${variant.id}">${variant.title} - ${Shopify.formatMoney(variant.price)}</option>`;
      });
      $(inlineFormOptionsEL).find('.select select').attr('id', 'product-select-' + product.id).append(variantsOption);
      //  inlineFormOptionsEL
      $(options).each(function (i, option) {
        var opt = option.name;
        var selectClass = '.option.' + opt.toLowerCase();
        var variantSwatch = $(inlineFormOptionsEL).find('.ipo-product-options').data('variant-swatch');
        var variantSwatchImg = $(inlineFormOptionsEL).find('.ipo-product-options').data('variant-swatchimg');
        var swtchWrap = '';
        var optionHide = '';
        var defultOption = '';
        // console.log(opt);
        if (opt == 'Title') {
          var defultOption = ' hidden';
        }
        if (variantSwatch == true) {
          // var optionHide = ' hidden';
          var swtchWrap = '<div data-option-index="' + i + '" class="option-selection swatch option-selection-swatches option-selection-' + opt.toLowerCase() + '-swatches' + defultOption + '" data-option="' + opt.toLowerCase() + '"></div>';
        }
        // console.log(swtchWrap);
        $(inlineFormOptionsEL).find('.ipo-product-options .swatch_options').append(swtchWrap);
        $(inlineFormOptionsEL).find('.ipo-product-options .product-form__controls-group').append('<div class="option-selection option-selection-' + opt.toLowerCase() + optionHide + defultOption + '" data-option="' + opt.toLowerCase() + '"><span class="option">' + opt + '</span><div class="select"><select class="single-option-selector option-' + i + ' option ' + opt.toLowerCase() + ' select__select"></select><svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-caret" viewBox="0 0 10 6"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.354.646a.5.5 0 00-.708 0L5 4.293 1.354.646a.5.5 0 00-.708.708l4 4a.5.5 0 00.708 0l4-4a.5.5 0 000-.708z" fill="currentColor"></path></svg></div></div>');

        $(option.values).each(function (i, value) {
          var value = product.options_with_values !== undefined ? value.title : value;
          // console.log('value: ', value);
          // Color swatched hack
          var select_option = '';
          var swatch_img_name = '';
          var swatchStyle = '';
          if (i == 0) {
            select_option = "checked='checked'";
          }
          var optionName = option.name.toLowerCase();
          if (optionName == 'color') {
            var swatch_img_name = value;
            swatch_img_name = swatch_img_name.toLowerCase();
            swatch_img_name = swatch_img_name.replace(" ", "");
            swatch_Color = swatch_img_name;
            // console.log(swatch_Color);
            swatch_img_name = 'https://cdn.shopify.com/s/files/1/0271/0224/9041/t/7/assets/' + swatch_img_name + '.png';
            // console.log(swatch_img_name);
            if (variantSwatchImg == true) {
              var swatchStyle = 'style="background-color: ' + swatch_Color + ';background-image:url(' + swatch_img_name + ');"';
            } else {
              var swatchStyle = 'style="background-color: ' + swatch_Color + ';"';
            }
          }
          var valueName = value;
          $(inlineFormOptionsEL).find('.option-selection-' + opt.toLowerCase() + '-swatches').append('<div class="product-single__swatch__item swatch-element" value="' + value + '" data-value="' + value + '"><input type="radio" ' + select_option + ' class="product-single__swatch__input u-hidden-visually" id="' + product.id +'-'+ value + '" name="' + opt + '" value="' + value + '" /><label for="' + product.id +'-'+ value + '" data-' + opt + '="' + value + '" class="product-single__swatch__label"><span class="product-single__swatch__label__graphic" ' + swatchStyle + '>' + valueName + '</span></label></div>');
          $(inlineFormOptionsEL).find('.option.' + opt.toLowerCase()).append('<option value="' + value + '">' + value + '</option>');
        });
      });
      $(inlineFormOptionsEL).find('.product-single__swatch__item input[type=radio]').click(function() {
        var value = $(this).val(),
        index = $(this).closest('.swatch').data('option-index'),
        targetSelect = $(this).closest('.ipo-product-options').find('.product-form__controls-group .option-selection:eq('+index+')').find('select');
        if (value != '') {
          // console.log(value, this);
          $(targetSelect).val(value).change();
        }
        // console.log(this);
        // targetLabel = $(this).closest('.option-selection-color-swatches').find('.option b');
      });
      // .product-form__controls-group
      $(inlineFormOptionsEL).find('.product-form__controls-group .option-selection select').change(function() {
        console.log('value: ',$(this).val());
        var selectedOptions = '';
        var formEl = $(this).closest('.inline-form-options');
        var formElOptionSelection = formEl.find('.product-form__controls-group .option-selection select');
        $(formElOptionSelection).each(function (i) {
          if (selectedOptions == '') {
            selectedOptions = $(this).val();
          } else {
            selectedOptions = selectedOptions + ' / ' + $(this).val();
          }
        });
        var productVariants = product.variants;
        $(productVariants).each(function (i, v) {
          if (v.title == selectedOptions) {
            console.log('test',v);
            // console.log('that');
            // console.log(v.id);
            // select#product-select-6554884243555
            // console.log(product.id);
            // console.log(this);
            $(formEl).find('select#product-select-'+product.id).val(v.id).change();
            // updateInventoryNotice(v,product);
            var price = parseFloat(v.price / 100).toFixed(2);
            var original_price = parseFloat(v.compare_at_price / 100).toFixed(2);
            var v_qty = v.inventory_quantity;
            var v_inv = v.inventory_management;

            if (v.available == false) {
              $('.qv-content .product__price .price__regular .price-item--regular').text(Shopify.formatMoney(price));
              $('.qv-content .product__price .price').removeClass('price--on-sale');
              $('.qv-content .product__price .price').addClass('price--sold-out ');
              $('.qv-content .product__price .badge').remove();
              $('.qv-content .product__price .price').append('<span class="badge price__badge-sold-out color-inverse" aria-hidden="true">Sold out</span>');
              // console.log('sold')
            } else if (v.compare_at_price > v.price) {
              $('.qv-content .product__price .price__sale .price-item--sale').text(Shopify.formatMoney(price));
              $('.qv-content .product__price .price__sale .price-item--regular').text(Shopify.formatMoney(original_price));
              $('.qv-content .product__price .price').addClass('price--on-sale');
              $('.qv-content .product__price .price').removeClass('price--sold-out ');
              $('.qv-content .product__price .badge').remove();
              $('.qv-content .product__price .price').append('<span class="badge price__badge-sale color-accent-2" aria-hidden="true">Sale</span>');
              // console.log('sale');
            } else if (v.compare_at_price == null || v.compare_at_price < v.price) {
              $('.qv-content .product__price .price__regular .price-item--regular').text(Shopify.formatMoney(price));
              $('.qv-content .product__price .price').removeClass('price--on-sale');
              $('.qv-content .product__price .price').removeClass('price--sold-out ');
              $('.qv-content .product__price .badge').remove();
              // console.log('Null & no sale');
              // console.log('Null');
            }
            console.log('Available: ',v.available);
            if (v.available == true) {
              $(formEl).find('.ipo-add-button').prop('disabled', false).find('[data-add-to-cart-text]').text(window.variantStrings.addToCart);
            } else {
              $(formEl).find('.ipo-add-button').prop('disabled', true).find('[data-add-to-cart-text]').text(window.variantStrings.soldOut);
            }
          }
        });
      });
      // console.log($(inlineFormOptionsEL).find('form'));
      $(inlineFormOptionsEL).find('form').submit(function() {
        var qty = $(inlineFormOptionsEL).find('.qv-quantity').val();
        var selectedOptions = '';
        // var var_id = $('#quick-view .product-form select').val();
        var var_id = $(inlineFormOptionsEL).find('select[name="id"]').val();
        processInlineCart();
        function processInlineCart() {
          console.log(var_id);
          // console.log('quick-view submit, qty:',qty,'variant id: ',var_id);
          // console.log($(inlineFormOptionsEL).find('.ipo-add-button'));
          $(inlineFormOptionsEL).find('.ipo-add-button').text('Adding').prop('disabled', true);
          jQuery.post('/cart/add.js', {
            quantity: qty,
            id: var_id
          },
            null,
            "json"
          ).done(function () {
            $(inlineFormOptionsEL).find('.ipo-add-button').text('Added').prop('disabled', false);
            // $(inlineFormOptionsEL).find('.ipo-add-to-cart-response').addClass('success').fadeIn().html('<span>' + $('.ipo-product-title').text() + ' has been added to your cart. <a href="/cart">Click here to view your cart.</a>');
            fetch('/cart.js', { credentials: 'same-origin' }).then(function(response) {return response.json();}).then(function(cart) {
              // console.log(cart.item_count);
              $('.cart-count-bubble span[aria-hidden]').text(cart.item_count),
              $('.cart-count-bubble span.visually-hidden').text(cart.item_count <= 1 ? cart.item_count+' item' : cart.item_count+' items');
            }).catch(function(error) {console.log(error);});


            setTimeout(function() {
              $(inlineFormOptionsEL).find('.ipo-add-button').text('Add to cart').prop('disabled', false);
              $(inlineFormOptionsEL).find('.ipo-add-to-cart-response').slideUp();
            }, 2500);
            setTimeout(function() {
              $(inlineFormOptionsEL).find('.ipo-add-to-cart-response').text(null).removeClass('success')
            }, 3000);

          })
            .fail(function ($xhr) {
              var data = $xhr.responseJSON;
              $(inlineFormOptionsEL).find('form .ipo-add-button').text('Error').prop('disabled', false);
              $(inlineFormOptionsEL).find('.ipo-add-to-cart-response').addClass('error').html('<span><strong>ERROR: </strong>' + data.description);
              setTimeout(function() {
                $(inlineFormOptionsEL).find('.ipo-add-button').text('Add to cart').prop('disabled', false);
              }, 2500);
              setTimeout(function() {
                $(inlineFormOptionsEL).find('.ipo-add-to-cart-response').text(null).removeClass('error')
              }, 3000);
            });
        }
        return false;
      });
    });
  }
};
