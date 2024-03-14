# os-installer-arkdep patch notes
These are the configuration scripts for os-installer used to install the immutable variant of Arkane Linux.

## 14.03.2024
- Fixed GNOME keymap not compiling to dconf
- Init Arkdep and perform first deployment using the ISO's Arkdep
- Dropped recovery environment and related components
- Completely refactor user and group creation to no longer rely on the recovery environment
