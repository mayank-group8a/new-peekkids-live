$(document).ready(function () {
    inlineFormOptions();
});
function inlineFormOptions() {
    // console.log('this');
    var inlineFormOptionsEL = $(".inline-form-options");
    console.log(inlineFormOptionsEL.length);
    if (inlineFormOptionsEL.length > 0) {
        inlineFormOptionsEL.each(function (thisEl) {
            var inlineFormWrap = $(this).closest('.inline-form-wrap');
            $(inlineFormWrap).find('.inline-form-options').html('');
            var inlineformHTML = '';
            inlineformHTML = quickATC;
            console.log(inlineformHTML);
            // console.log(quickATC);
            var product = JSON.parse(inlineFormWrap.find('.product-script').html());
            // console.log(product);
            var price = 0;
            var original_price = 0;
            const variants = product.variants;
            if (product.options_with_values !== undefined){
                var options = product.options_with_values;
            } else {
                var options = JSON.parse(inlineFormWrap.find('.product-options-with-values-script').html());
            }
            $(options).each(function (i, option) {
                var opt = option.name;
                var selectClass = '.option.' + opt.toLowerCase();
                var variantSwatch = true;
                var variantSwatchImg = true;
                var swtchWrap = '';
                var optionHide = '';
                var defultOption = '';
                if (opt == 'Title') {
                  var defultOption = ' hide';
                }
                if (option.values.length < 2){
                  var defultOption = ' lowOption'
                }
                if (variantSwatch == true) {
                  var optionHide = ' hide';
                  var swtchWrap = '<div data-option-index="' + i + '" id="'+product.id+'-'+opt+'" class="option-selection swatch option-selection-swatches option-selection-' + opt.toLowerCase() + '-swatches' + defultOption +'"></div>';
                }
                $(inlineformHTML).find('.qv-product-options .swatch_options').prepend(swtchWrap);
                $(inlineformHTML).find('.qv-product-options .product-form__controls-group').addClass(defultOption).prepend('<div class="option-selection option-selection-' + opt.toLowerCase() + optionHide + defultOption + '"><span class="option">' + opt + '</span><select class="single-option-selector option-' + i + ' option ' + opt.toLowerCase() + '"></select></div>');

                $(option.values).each(function (i, value) {
                  // Color swatched hack
                  var select_option = '';
                  var swatch_img_name = '';
                  var swatchStyle = '';
                  if (i == 0) { select_option = "checked='checked'"; }
                  if (option.name == 'Color') {
                    var swatch_img_name = value;
                    swatch_img_name = swatch_img_name.toLowerCase();
                    swatch_img_name = swatch_img_name.replace(" ", "-");
                    swatch_Color = swatch_img_name;
                    // console.log(swatch_Color);
                    var swatch_assets_img = assetUrl;
                    swatch_img_name = swatch_assets_img.replace('quickview.js', swatch_img_name+'.png');
                    // console.log(swatch_img_name);
                    if (variantSwatchImg == true) {
                      var swatchStyle = 'style="background-color: ' + swatch_Color + ';background-image:url(' + swatch_img_name + ');"';
                    } else {
                      var swatchStyle = 'style="background-color: ' + swatch_Color + ';"';
                    }
                  }
                  var valueName = value;
                  $(inlineformHTML).find('.option-selection-' + opt.toLowerCase() + '-swatches')
                    .append('<div class="product-single__swatch__item swatch-element" value="' + value + '" data-value="' + value + '"><input type="radio" ' + select_option + ' class="product-single__swatch__input u-hidden-visually" id="' +product.id +'-' + opt + value + '" name="' +product.id +'-' + opt + '" value="' + value + '" /><div for="' +product.id +'-' + opt + value + '" class="product-single__swatch__label"><span class="product-single__swatch__label__graphic" ' + swatchStyle + '>' + valueName + '</span></div></div>');
                  $(inlineformHTML).find('.option.' + opt.toLowerCase()).append('<option value="' + value + '">' + value + '</option>');
                });
              });
              // console.log(product.variants.length);
              // console.log(product);
              var availableVariants = '';
              $(product.variants).each(function (i, v) {
                if (v.available == true) {
                  $(inlineformHTML).find('.qv-add-button').prop('disabled', false).find('[data-add-to-cart-text]').text('Add to cart');
                } else {
                  $(inlineformHTML).find('.qv-add-button').prop('disabled', true).find('[data-add-to-cart-text]').text('Sold Out');
                }
                if (v.inventory_quantity == 0) {
                  $(inlineformHTML).find('.qv-add-button').prop('disabled', true).val('Sold Out');
                  $(inlineformHTML).find('.qv-add-to-cart').hide();
                  $(inlineformHTML).find('.qv-product-price').text('Sold Out').show();
                  return true
                } else {
                  availableVariants = v.id;
                  price = parseFloat(v.price / 100).toFixed(2);
                  original_price = parseFloat(v.compare_at_price / 100).toFixed(2);

                  // console.log('price: '+ theme.Currency.formatMoney(v.price,theme.moneyFormat)+', Orignal Price: '+ theme.Currency.formatMoney(v.compare_at_price,theme.moneyFormat));
                  // console.log('Compare at price: ',Shopify.formatMoney(v.price, theme.moneyFormat), 'Compare at price: ',Shopify.formatMoney(v.compare_at_price, theme.moneyFormat));

                  /* update the price
                    if (v.compare_at_price > v.price) {
                        $(inlineformHTML).find('.price__pricing-group .price__sale .price-item--sale').text(Shopify.formatMoney(price, theme.moneyFormat));
                        $(inlineformHTML).find('.price__pricing-group .price__sale .price-item--regular').text(Shopify.formatMoney(original_price, theme.moneyFormat));
                        $(inlineformHTML).find('.product__price dl.price ').addClass('price--on-sale');
                        // console.log('sale');
                    } else if (v.compare_at_price == null) {
                        $(inlineformHTML).find('.price__pricing-group .price__regular .price-item--regular').text(Shopify.formatMoney(price, theme.moneyFormat));
                        $(inlineformHTML).find('.product__price dl.price').removeClass('price--on-sale');
                        // console.log('Null');
                    } else if (v.compare_at_price < v.price) {
                        $(inlineformHTML).find('.price__pricing-group .price__regular .price-item--regular').text(Shopify.formatMoney(price, theme.moneyFormat));
                        $(inlineformHTML).find('.product__price dl.price').removeClass('price--on-sale');
                        // console.log('No sale');
                    }
                  */

                  $(inlineformHTML).find('select.option-0').val(v.option1);
                  $(inlineformHTML).find('select.option-1').val(v.option2);
                  $(inlineformHTML).find('select.option-2').val(v.option3);
                  return false
                }
              });
              var variantsOption = '';
              $(product.variants).each(function (i, variant) {
                // if(variant.id == availableVariants){} else {}
                variantsOption += `<option value="${variant.id}" ${variant.id == availableVariants ? 'selected="selected"' : ''}>${variant.title} - ${Shopify.formatMoney(variant.price)}</option>`;
              });
              $(inlineformHTML).find('.select').html(`<select id="product-select-${product.id}" name="id" style="display: none;">${variantsOption}</select>`)
              // $(inlineformHTML).find().html(); inlineQuickVIew
              if($(inlineformHTML).find('.option-selection:visible').length < 1){
                $(inlineformHTML).addClass('alloptionHidden');
              }
            // console.log(product);
            // console.log(inlineFormOptionsEL.html());
            ///
            // console.log($(inlineFormWrap));
            // inlineFormWrap
            // console.log(inlineformHTML);
            $(inlineFormWrap).find('.inline-form-options').html(inlineformHTML);
        });
    }
};
