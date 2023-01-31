class PopupNewsletter extends HTMLElement {
    constructor() {
        super();
        const thisModalMode = Object(document.querySelector('.newsletterwrapper'));
        const expire = thisModalMode.dataset.expire;
        const delay = thisModalMode.dataset.delay;
        if(thisModalMode.dataset.displayMode == 'testing'){
            console.log('Normaly');
            openEmailModalWindow();
        } else if(thisModalMode.dataset.displayMode == 'true'){
            function getCookie(cname) {
                let name = cname + "=";
                let decodedCookie = decodeURIComponent(document.cookie);
                let ca = decodedCookie.split(';');
                for(let i = 0; i < ca.length; i++) {
                  let c = ca[i];
                  while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                  }
                  if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                  }
                }
                return "";
            }
            let checkEmailSubcribeModal = getCookie("emailSubcribeModal");
            if (checkEmailSubcribeModal != 'closed') {
                // console.log('popup init');
                openEmailModalWindow();
            }
        }
        jQuery('#newsletterModalContent .btn-close').click(function (e) {
            e.preventDefault();
            closeEmailModalWindow();
        });
        jQuery('body').keydown(function (e) {
            if (e.which == 27) {
                e.preventDefault();
                closeEmailModalWindow();
                jQuery('body').unbind('keydown');
            }
        });
        jQuery('#newsletterModalContent form').submit(function () {
            closeEmailModalWindow();
        });
        function setCookie(cname,cvalue,exdays) {
            const d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            let expires = "expires=" + d.toGMTString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }
        function closeEmailModalWindow() {
            $.fancybox.close({
                src: '#newsletterModalContent'
            });
            if (thisModalMode.dataset.displayMode == 'true') {
                setCookie("emailSubcribeModal", 'closed', expire);
            }
        }
        function openEmailModalWindow() {
            setTimeout(function () {
                $.fancybox.open({
                    src: '#newsletterModalContent',
                    type: 'inline',
                    opts: {
                        modal: true,
                        afterShow: function (instance, current) {
                            //console.info( 'done!' );
                        }
                    }
                });
            }, delay * 1000);
        }
    }
}
customElements.define('popup-newsletter', PopupNewsletter);