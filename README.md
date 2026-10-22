# AdminAid

AdminAid is a developer and administrator toolbox for the Exponential 6.x administration interface. It adds an
**AdminAid** tab to the admin and a module named `aid` with five tools:

| Tool | URL | What it does |
| --- | --- | --- |
| Database search | `aid/search` | Finds content objects, nodes, attributes, classes, users, states, URLs, workflows and more by ID or by text, straight from the kernel's database tables. |
| Object details | `aid/object_view/<object_id>` | Shows everything about one content object: remote ID, dates, its nodes and their remote IDs, all versions and every attribute with its IDs. |
| Objects of a class | `aid/object_list/<class_id>` | Lists every content object of one content class, page by page. |
| Class translation | `aid/class_translation/<class_id>` | Edits the name of a class and of all its attributes in every language on one page, adds languages to the class and copies translations from an attribute of another class. |
| User switch | `aid/user_switch/<user_id>` | Logs an allowed administrator in as any other user, without that user's password. |

It is meant for developers, integrators and site administrators who debug a site, look for the object behind an ID
in a log message, or translate content classes. In the admin4 design the tab shows the `question-circle` icon.

> **Use it with care on production sites.** The user switch logs you in as another user without a password. It is
> limited to the user IDs you list in `aid.ini` (and optionally to IP addresses) and to roles that grant
> `aid/user_switch`, but enable it on a live site only for as long as you need it.

## Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Permissions](#permissions)
- [Upgrading](#upgrading)
- [Known limits](#known-limits)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Credits and history](#credits-and-history)

## Requirements

- Exponential 6.x (the legacy kernel)
- PHP 8.0 or newer
- An administration siteaccess

AdminAid has no database tables of its own and needs no other extension.

## Installation

The extension must be installed in a directory named **`adminaid`** (lowercase): its settings register the module
and the templates under that name (`ExtensionRepositories[]=adminaid`, `DesignExtensions[]=adminaid`).

### With Composer

From the root of your Exponential installation:

```bash
composer require se7enxweb/adminaid
```

The package type is `ezpublish-legacy-extension`, so the legacy extension installer places it in
`extension/adminaid/`.

### By hand

1. Download the latest release from <https://github.com/se7enxweb/AdminAid/releases> (or clone the repository)
   into `extension/adminaid/` of your installation:

   ```bash
   git clone https://github.com/se7enxweb/AdminAid.git extension/adminaid
   ```

2. Activate the extension in `settings/override/site.ini.append.php`:

   ```ini
   [ExtensionSettings]
   ActiveExtensions[]=adminaid
   ```

### After either installation

Regenerate the extension autoloads and clear the caches, from the installation root:

```bash
php bin/php/ezpgenerateautoloads.php -e
php bin/php/ezcache.php --clear-all
```

Then give the people who need it access (see [Permissions](#permissions)) and set the user switch list (see
[Configuration](#configuration)).

## Configuration

AdminAid reads `aid.ini`. Do not edit the copy in the extension; override it in
`settings/override/aid.ini.append.php` (or in a siteaccess or your own settings extension).

### [Aid]: who may use the user switch

```ini
<?php /* #?ini charset="utf-8"?

[Aid]
# Content object IDs of the users that may switch to other users.
# 14 is the administrator user of a standard installation.
UserSwitchIDLimit[]
UserSwitchIDLimit[]=14
UserSwitchIDLimit[]=2345

# Allow the switch only from these client IP addresses
LimitByIP=enabled
IPList[]
IPList[]=127.0.0.1
IPList[]=192.0.2.10

*/ ?>
```

| Setting | Default | Meaning |
| --- | --- | --- |
| `UserSwitchIDLimit[]` | `14` | Content object IDs of the users allowed to switch. Anyone else gets "access denied". |
| `LimitByIP` | `disabled` | `enabled` also requires the client address (`REMOTE_ADDR`) to be in `IPList[]`. |
| `IPList[]` | empty | The allowed client IP addresses when `LimitByIP=enabled`. |
| `UserClass[]` | `user` | Present in the settings file; the current code does not read it. |

Behind a reverse proxy `REMOTE_ADDR` is the proxy's address, so list that address or keep `LimitByIP=disabled`.

### [SearchDatabase]: what the database search looks at

The search runs once per entry of `ClassList[]`. Each entry is a kernel persistent object class; `TableID[<class>]`
names the column a numeric search word is compared with, `TableText[<class>]` the column a text search word is
matched against (`LIKE '%word%'`). A class without `TableText` is only searched by ID.

The shipped list covers `eZContentObject`, `eZContentObjectTreeNode`, `eZContentObjectAttribute`,
`eZContentObjectVersion`, `eZContentClass`, `eZContentClassAttribute`, `eZUser`, the object state classes,
`eZContentLanguage`, `eZContentBrowseBookmark`, `eZImageFile`, `eZInformationCollectionAttribute`,
`eZNodeAssignment`, `eZURL`, `eZUrlAliasML` and `eZWorkflow`. To add one of your own persistent object classes:

```ini
[SearchDatabase]
ClassList[]=myCustomObject
TableID[myCustomObject]=id
TableText[myCustomObject]=title
```

The class must have a static `definition()` method, as every `eZPersistentObject` class has.

### Settings the extension registers itself

You do not need to change these; they are listed so you know what the extension adds:

- `module.ini`: the `aid` module (`ModuleList[]=aid`).
- `menu.ini`: the **AdminAid** tab (`[Topmenu_aid]`, `Icon=question-circle`, opens `aid/search`) and its navigation
  part `aidnavigationpart`.
- `admininterface.ini`: the extra context menu entries (`node/ezaidcontextmenu.tpl`,
  `node/ezaidsubitemscontextmenu.tpl`).
- `design.ini`: the extension's templates (`DesignExtensions[]=adminaid`).

## Usage

### The AdminAid tab and the database search

Click **AdminAid** in the top menu of the admin (in admin4 it carries the question mark icon). It opens
`aid/search`. Type a number to look up that ID in every configured table, or text to search the text columns. The
`limit` field sets how many hits per table are shown (5 by default).

Examples:

- `57` finds content object 57, node 57, attribute 57, class 57, the user with content object ID 57, and so on.
- `frontpage` finds objects named "frontpage", nodes whose path contains it, URL aliases with that text and more.

### Object details

In the content structure, click the icon of an object to open its context menu and choose **View object details**,
or open the URL yourself, in the admin or on the site:

```
/aid/object_view/57
```

The page shows the object's remote ID, published and modified dates, the list of its nodes with their remote IDs,
all versions and every attribute. Point at an attribute name to see its identifier, class attribute ID and
attribute ID in the tooltip.

### All objects of a class

In **Setup > Classes**, open a class. Its object count is a link to `aid/object_list/<class_id>`, the list of all
objects of the class. The list takes an optional page size (1 to 1000, 25 by default) and an offset:

```
/aid/object_list/2                     first 25 objects of class 2
/aid/object_list/2/100                 first 100 objects
/aid/object_list/2/100/(offset)/100    objects 101 to 200
```

### Translating a class

On the class view page (admin and admin2 designs), click **Translate on all languages** under the attribute list.
The page lets you:

- edit the class name and the name of each attribute in every language of the class at once, and store them with
  **OK** or **Apply**;
- add languages of your installation to the class (tick them at the bottom, then **Add language**);
- copy the translations of an attribute from another class: click **Copy translations from other attribute**, pick
  the attribute (AdminAid preselects one with the same identifier) and click **Apply** to store them.

The translations are stored and active immediately. The class is not put into edit mode, so someone editing the
same class at the same time can overwrite your changes, or you theirs.

### Switching to another user

Open the context menu of a user in the admin and choose **Switch user**, or open the URL:

```
/aid/user_switch/2345
```

AdminAid logs you in as that user and sends you back to the page you were on. To become yourself again, log out
and log in with your own account. If you are not in `UserSwitchIDLimit[]`, your IP address is not allowed, or the
user does not exist, the page shows "access denied".

## Permissions

The module defines four policy functions (Roles and policies, a role, New policy, module `aid`):

| Function | Views it opens |
| --- | --- |
| `aid/search` | `search` |
| `aid/object_view` | `object_view`, `object_list` |
| `aid/class_translate` | `class_translation`, `class_attribute_select` |
| `aid/user_switch` | `user_switch` (the `aid.ini` list applies on top) |

Administrators with the `*/*` policy already have all of them. Give the others only to the roles that need them.

## Upgrading

Replace the files in `extension/adminaid/` (or run `composer update se7enxweb/adminaid`), keep your settings in
`settings/override/`, then regenerate the autoloads and clear the caches as in [Installation](#installation).
There are no database changes between versions.

## Known limits

- The class view override with the object list link and the **Translate on all languages** button exists for the
  admin and admin2 designs; with other designs open `aid/object_list/<class_id>` and
  `aid/class_translation/<class_id>` by URL.
- The search runs one query per configured table and uses `LIKE '%word%'` for text, which can be slow on large
  tables. Keep the limit small on big sites.
- The user switch replaces your session; there is no "switch back" button.

## Troubleshooting

- **No AdminAid tab:** check that the extension directory is named `adminaid` and is in `ActiveExtensions[]`, then
  clear the INI cache (`php bin/php/ezcache.php --clear-tag=ini`). In the browse and edit contexts the tab is shown
  but not clickable, by design.
- **"Module not found" for `aid/...`:** the directory name differs from `adminaid`, or the autoloads and caches were
  not refreshed after activation.
- **"Access denied" on the user switch:** your own user's content object ID is not in `UserSwitchIDLimit[]`,
  `LimitByIP=enabled` and your address is not listed, or your role lacks `aid/user_switch`.
- **The context menu entries are missing:** clear the template caches (`php bin/php/ezcache.php --clear-tag=template`)
  and reload the page so `adminaid_admin.js` is loaded.

## Contributing

Issues and pull requests are welcome at <https://github.com/se7enxweb/AdminAid>. The admin templates must carry no
inline CSS; the check runs without a kernel:

```bash
php tests/adminaidadmininlinecsstest.php
```

## License

GNU General Public License, version 2. See [doc/LICENSE](doc/LICENSE) and [doc/COPYRIGHT.md](doc/COPYRIGHT.md).

## Credits and history

AdminAid was written by A. Bakkeboe (Arne) in 2010 as a small module to switch users while debugging, and grew into
the toolbox above. Brookins Consulting reorganized its documentation and updated it for eZ Publish 4.3 and newer in
2012; it was tested on eZ Publish 4.1 to 4.3 and Community Build 2012.02, the system that later continued as
Exponential. 7x (<https://se7enx.com>) has maintained it for Exponential 6.x and PHP 8 since 2024. See
[CHANGELOG.md](CHANGELOG.md) for the changes per release.
