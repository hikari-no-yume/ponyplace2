window.ponyplace2 = (function (ponyplace2) {
    'use strict';

    window.onload = function () {
        ponyplace2.dom.init();
    };

    window.onerror = function (errmsg, url, lineno) {
        alert('Error! ' + errmsg + ' in ' + url + ' @ ' + lineno);
        console.log('Error! ' + errmsg + ' in ' + url + ' @ ' + lineno);
        return false;
    };

    return ponyplace2;
}(window.ponyplace2));
