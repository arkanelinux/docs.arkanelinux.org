# Arkane Linux patch notes

## 2024.07.09
- `rd.auto=0` added to kernel params on new installs to work around Dracut + LUKS bug

## 2024.07.08
- Fix several bugs which prevented installing to partition
- Fix UUID detection for NVMe drives which would cause no UUID to be configured in the LUKS rootfs kernel parameters

## 2024.07.07
- Attempt to set vconsole keymap during install

## 2024.07.05
- Account creation no longer done during install, is now instead done using gnome-initial-setup on first boot
- Plymouth no longer added to initramfs on new installs, should fix the issue of the LUKS password prompt not appearing on certain hardware configurations

## 2024.06.15
- Replaced default Flatpak app Evince with Papers
