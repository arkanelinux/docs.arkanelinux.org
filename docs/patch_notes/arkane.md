# Arkane Linux patch notes

## 2024.07.07
- Attempt to set vconsole keymap during install

## 2024.07.05
- Account creation no longer done during install, is now instead done using gnome-initial-setup on first boot
- Plymouth no longer added to initramfs on new installs, should fix the issue of the LUKS password prompt not appearing on certain hardware configurations

## 2024.06.15
- Replaced default Flatpak app Evince with Papers
