# How do I...

## Install AUR packages
Arkdep-build does not support installing AUR packages using an AUR helper, to install AUR packages use one of the following methods;

- Add a repo containing pre-packaged AUR packages such as the [Chaotic-AUR](https://aur.chaotic.cx/) to your pacman.conf
- Manually build and add AUR packages to a personal ([local](https://wiki.archlinux.org/title/Pacman/Tips_and_tricks#Custom_local_repository)) Pacman package reposity

## Unlock the root filesystem
The root filesystem is locked only using Btrfs properties.

> 📝 *Note that any changes made to root will not carry over to future deployments*

```console
sudo btrfs subvolume property set / ro false
```
