# A technical overview of Arkane Linux
Arkane Linux has two versions available for download;

- The flagship immutable version, this version utilizes Arkdep to provide immutability
- A normal non-immutable version, this is little more than Arch Linux with some custom Arkane Linux patches and branding

## Shared GNOME config
The GNOME variants all provide a very comparable configuration, a stock gnome-shell with the following notable tweaks and configurations;

- Dark mode by default
- A custom wallpaper
- Preloaded with stable but not (yet) default apps from the GNOME Circle and GNOME Project
- `mutter-dynamic-buffering` patches included
- Rebuild of `gnome-software` with packagekit support
- `/home` Btrfs subvolume
- systemd-boot bootloader

## Arkdep variant configuration

Arkdep images mostly grab the above mentioned configuration with the exclusion of the packagekit plugin, since the system is immutable and managed by Arkdep there is no reason to include it.

The following changes are applied to the filesystem through symlinking;

- `/opt` is symlinked to `/var/opt`
- `/srv` is symlinked to `/var/srv`
- `/usr/local` is symlinked to `/var/usrlocal`
- `/usr/lib/locale` is symlinked to `/var/usrliblocale`

The following changes are applied through subvolumes;

- `/root` is a subvolume located at `/arkdep/shared/root`
- `/home` is a subvolume located at `/arkdep/shared/home`
- `/var/lib/flatpak` is a subvolume located at `/arkdep/shared/flatpak`

And the following changes in software and configuration;

- Most core applications are installed on first boot as Flatpak
- `libnss-extrausers` PAM module included by default
- `shadow`, `passwd` and `group` files with system accounts are stored in `/usr/lib`, these are loaded by the extrausers PAM module
- `shadow`, `passwd` and `group` files in `/etc` exclusively store root and normal user accounts
- `podman` is included by default

Some notable quirks you should be aware of;

- `/etc` is a separate subvolume living inside of the root of the deployment, it is writable by default
- `/var` is a separate subvolume living inside of the root of the deployment, it is writable by default
- Any changes outside of `/home` or files/folders defined in migrate\_files do not carry over between deployments
- `/home` is are shared between all deployments and are stored in `/arkdep/shared/home`
- `/root` is are shared between all deployments and are stored in `/arkdep/shared/root`
- `/var/lib/flatpak` is are shared between all deployments and are stored in `/arkdep/shared/flatpak`
- Adding any overlay files outside of `/arkdep/overlay/etc` will make arkdep temporarily unlock the root subvolume for editing
