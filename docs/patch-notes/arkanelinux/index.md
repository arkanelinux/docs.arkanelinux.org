# Arkane Linux patch notes

> [!NOTE]
> These patch notes are not exhaustive and only list select changes at arbitrary points in time.


## 2025.12.18

- Add realtime-privileges.
- Swap sudo with sudo-rs.

##  2025.07.5

- Default localtime to UTC to fix systemd-firstboot soft freezing the system at first boot.

## 2025.04.06

- Added OpenRGB udev rules.

## 2025.03.19

- Arkdep now supports package layering.
- cristaline\_gravity is the new default wallpaper.
- linux-headers is now included in the image.
- linux and linux-headers are now excluded from pacman updates.
- pacman wrapper now also allows rootless -Sl.
- v4l2loopback-dkms and v4l2loopback-utils added for virtual camera support in OBS.

## 2024.10.26

- Fix installer not detecting NVMe SSDs which report their size as zero.

## 2024.09.30

- Add gamepad udev rules, this allows for various gamepads to be used by Flatpaks such as Steam.
- Arkane Linux Arkdep versions now use arkanelinux-yyyy-mm-dd pretty names instead of random strings.

## 2024.09.06

- Implemented systemd-bless-boot.
- Dropped EFI variable bootloader selector.
- Bootloader entries are now timestamped.
- Bootloader entries now prioritized based on name.

## 2024.08.23

- arkdep\_bin has been renamed to abin.
- abin added to secure\_path for sudo.
- usrliblocale has been dropped in favor of pregenerated glibc-locales.
- var/nm-system-connections has been dropped.
- var/db is now also migrated.
- var/lib/power-profiles-daemon is now also migrated.
- gnome-calendar is now shipped as Flatpak.

## 2024.08.15

- Replaced gnome-pictures with Fotema.
- Replaced Celluloid with Showtime.

## 2024.07.09

- rd.auto=0 added to kernel params on new installs to work around dracut breaking LUKS.

## 2024.07.08

- Fix several bugs which prevented installing to partition.
- Fix UUID detection for NVMe drives which would cause no UUID to be configured in the LUKS rootfs kernel parameters.

## 2024.07.07

- Attempt to set vconsole keymap during install.

## 2024.07.05

- Account creation no longer done during install, is now instead done using gnome-initial-setup on first boot.
- Plymouth no longer added to initramfs on new installs, should fix the issue of the LUKS password prompt not appearing on certain hardware configurations.

## 2024.06.15

- Replaced Evince with Papers.
