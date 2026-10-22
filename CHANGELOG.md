# Changelog

All notable changes to AdminAid. Versions follow the release tags on GitHub.

## 1.1.5 - 2026-10-21

- Updated: the AdminAid tab names the `question-circle` icon (`Icon=question-circle` in `[Topmenu_aid]` of
  menu.ini), which the admin4 design draws before the tab's name.
- Updated: a modern README covering every tool with examples, installation with Composer and by hand, every
  `aid.ini` setting, the policy functions, upgrading, known limits and troubleshooting. doc/INSTALL.md and
  doc/USAGE.md point to it.
- Added: composer.json (`se7enxweb/adminaid`, installed as `extension/adminaid`, PHP 8.0 or newer).
- Updated: ezinfo.php uses the class name the about page looks up (`adminaidInfo`); ezinfo.php and extension.xml
  state version 1.1.5, the license, the copyright holders and the website.
- Added: this CHANGELOG.md.

## 1.1.4 - 2026-10-17

- Updated: the context menu items and the children list run without inline code (a Content Security Policy
  without 'unsafe-inline'): the items' URLs are JSON in a data attribute, and
  design/standard/javascript/adminaid_admin.js adds them to the menu and opens it.

## 1.1.3 - 2026-10-17

- Updated: the language flag of class/view (admin and admin2) uses the shared a4-flag class instead of a style
  attribute.
- Added: extension.xml; ezinfo.php names the repository URL.
- Added: a test that fails on inline CSS in the admin templates.

## Earlier history

- 2024: GitHub funding information.
- 2012: documentation reorganized and templateInit() replaced by eZTemplate::factory() (Brookins Consulting).
- 2010 - 2011: first versions by A. Bakkeboe.
