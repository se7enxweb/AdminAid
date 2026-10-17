/*
 * AdminAid in the administration without inline code (pages under a Content Security Policy without
 * 'unsafe-inline'). Printed by the context menu templates (node/ezaidcontextmenu.tpl, node/ezaidsubitemscontextmenu.tpl)
 * and by children_detailed.tpl; sets itself up once however often it is printed.
 *  - [data-adminaid-menus='{"ContextMenu":{"menu-aid-switch":{"url":"..."}}}']: the menu items' entries, added to
 *    menuArray[menu]['elements'] of the admin's ezpopupmenu.js (added to, never assigned anew), when the file is
 *    printed and again when the page is parsed;
 *  - a[data-adminaid-menu-item="ContextMenu"]: pointing at it calls ezpopmenu_mouseOver( menu ), as the
 *    onmouseover attribute did;
 *  - [data-adminaid-toggle-name="DeleteIDArray[]"] (data-adminaid-toggle-form="children"): the "Invert selection"
 *    icon calls the admin's ezjs_toggleCheckboxes() for that form.
 */
(function () {
    function addMenus() {
        var nodes = document.querySelectorAll('[data-adminaid-menus]');
        for (var n = 0; n < nodes.length; n++) {
            var menus;
            try {
                menus = JSON.parse(nodes[n].getAttribute('data-adminaid-menus')) || {};
            } catch (e) {
                continue;
            }
            if (typeof window.menuArray !== 'object' || window.menuArray === null) {
                continue;
            }
            for (var menuID in menus) {
                var menu = window.menuArray[menuID];
                if (!menu) {
                    continue; // the menu is not set up yet: added again when the page is parsed
                }
                if (!menu['elements']) {
                    menu['elements'] = {};
                }
                for (var itemID in menus[menuID]) {
                    menu['elements'][itemID] = menus[menuID][itemID];
                }
            }
        }
    }

    addMenus();
    if (window.adminAidAdmin) {
        return;
    }
    window.adminAidAdmin = { addMenus: addMenus };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addMenus);
    }

    document.addEventListener('mouseover', function (event) {
        var item = event.target && event.target.closest ? event.target.closest('[data-adminaid-menu-item]') : null;
        if (item && typeof window.ezpopmenu_mouseOver === 'function') {
            window.ezpopmenu_mouseOver(item.getAttribute('data-adminaid-menu-item'));
        }
    });

    document.addEventListener('click', function (event) {
        var icon = event.target && event.target.closest ? event.target.closest('[data-adminaid-toggle-name]') : null;
        if (!icon) {
            return;
        }
        event.preventDefault();
        var form = document.forms[icon.getAttribute('data-adminaid-toggle-form')] || icon.closest('form');
        if (form && typeof window.ezjs_toggleCheckboxes === 'function') {
            window.ezjs_toggleCheckboxes(form, icon.getAttribute('data-adminaid-toggle-name'));
        }
    });
})();
