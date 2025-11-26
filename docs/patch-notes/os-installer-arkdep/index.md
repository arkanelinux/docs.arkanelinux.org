# os-installer-config-arkdep patch notes

## v2.11

- usrliblocale setup has been dropped.

## v2.10

- Boot partition is now configured and mounted through fstab with LABEL.

## v2.9

- rd.auto=0 added to kernel params on new installs to work around dracut breaking LUKS.

## v2.8

- Fixed UUID detection for NVMe.
- Handle OSI\_DEVICE\_IS\_PARTITION where required.

## v2.7

- Attempt to set vconsole keymap.

## v2.6

- Default Dracut config updated.
- Wait for root to unmount.

## v2.5

- Use gnome-initial-setup for account creation.

## v2.4

- Code and config cleanup.

## v2.3

- Code and config cleanup.
- Support the latest version of arkdep.

## v2.2

- No longer add dconf files via the overlay, these files are now included in the images if relevant.

## v2.1

- Fixed GNOME keymap not compiling to dconf.
- Init Arkdep and perform first deployment using the ISO's Arkdep.
- Dropped recovery environment and related components.
- Completely refactor user and group creation to no longer rely on the recovery environment/
