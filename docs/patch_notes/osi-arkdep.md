# os-installer-arkdep patch notes
These are the configuration scripts for os-installer used to install the immutable variant of Arkane Linux.

## v2.2
- No longer add dconf files via the overlay, these are now shipped via the image

## v2.1
- Fixed GNOME keymap not compiling to dconf
- Init Arkdep and perform first deployment using the ISO's Arkdep
- Dropped recovery environment and related components
- Completely refactor user and group creation to no longer rely on the recovery environment
