<hr/>
{* The items' entries for menuArray['ContextMenu'] as JSON; adminaid_admin.js adds them and opens the menu as before, so the
   page carries no inline code *}
<div hidden data-adminaid-menus="{json_encode( hash( 'ContextMenu', hash( 'menu-aid-switch', hash( 'url', '/aid/user_switch/%objectID%'|ezurl( 'no' ) ), 'menu-aid-view', hash( 'url', '/aid/object_view/%objectID%'|ezurl( 'no' ) ) ) ) )|wash}"></div>
{ezscript( array( 'adminaid_admin.js' ) )}

<a id="menu-aid-switch" href="#" data-adminaid-menu-item="ContextMenu">{"Switch user"|i18n( 'adminaid' )}</a>
<a id="menu-aid-view" href="#" data-adminaid-menu-item="ContextMenu">{"View object details"|i18n( 'adminaid' )}</a>
