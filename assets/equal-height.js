/* equal height */

/**
 * Javascript-Equal-Height-Responsive-Rows
 * https://github.com/modimayur/jquery-Equal-Height-product-grid/
 * Modi Mayur
 */

!function(i){"use strict";i.fn.equalHeight=function(){var e=[];return i.each(this,function(t,r){var s,n=i(r),a="border-box"===n.css("box-sizing")||"border-box"===n.css("-moz-box-sizing");s=a?n.innerHeight():n.height(),e.push(s)}),this.css("height",Math.max.apply(window,e)+"px"),this},i.fn.equalHeightGrid=function(e){var t=this.filter(":visible");t.css("height","auto");for(var r=0;r<t.length;r++)if(r%e===0){for(var n=i(t[r]),s=1;e>s;s++)n=n.add(t[r+s]);n.equalHeight()}return this},i.fn.detectGridColumns=function(){var e=0,t=0,r=this.filter(":visible");return r.each(function(r,n){var s=i(n).offset().top;return 0!==e&&s!==e?!1:(t++,void(e=s))}),t};var e=0;i.fn.responsiveEqualHeightGrid=function(){function n(){var i=t.detectGridColumns();t.equalHeightGrid(i)}var t=this,r=".grids_"+e;return t.data("grids-event-namespace",r),i(window).bind("resize"+r+" load"+r,n),n(),e++,this},i.fn.responsiveEqualHeightGridDestroy=function(){var e=this;return e.css("height","10"),i(window).unbind(e.data("grids-event-namespace")),this}}(window.jQuery);


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
function getEqualHeightGrid() {
  console.log('h');
 $("[data-equalheight-title]").responsiveEqualHeightGrid();
 $("[data-equalheight]").responsiveEqualHeightGrid();
}
