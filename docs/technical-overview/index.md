# Technical overview

## GNOME desktop

The GNOME configuration ships a stock gnome-shell with the following notable tweaks;

- Dark mode by default.
- A custom wallpaper.

## Filesystem

The following changes are made to the filesystem to make it function in an immutable context.

These directories are symlinked to another location;

- `/opt` is symlinked to `/var/opt`.
- `/srv` is symlinked to `/var/srv`.
- `/mnt` is symlinked to `/var/mnt`.
- `/usr/local` is symlinked to `/var/usrlocal`.

These directories are subvolume which are mounted at boot using fstab, these volumes are shared between all deployments;

- `/root` is a subvolume located at `/arkdep/shared/root`.
- `/home` is a subvolume located at `/arkdep/shared/home`.
- `/var/lib/flatpak` is a subvolume located at `/arkdep/shared/flatpak`.

These directories are separate subvolumes which are subvolumes unique to each deployment;

- `/etc` is writable and unique to each deployment.
- `/var` is writable and unique to each deployment.

## Operating system

The following changes are made to the operating system configuration to make it function in an immutable context.

- A patched version of the `libnss-extrausers` PAM module is included and enabled by default.
- `shadow`, `passwd` and `group` files with system accounts are stored in `/usr/lib`, these are loaded by the `libnss-extrausers` PAM module.
