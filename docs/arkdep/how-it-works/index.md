# How Arkdep works

## Arkdep-build

The build stage does a traditional Linux distro install in to a disk image. This disk image is partitioned with Btrfs and prepared with `rootfs/`, `rootfs/etc` and `rootfs/var` subvolumes.

In the case of archlinux build types, the installation is done very similar to a traditional Arch Linux install. First the base system is installed with pacstrap, then through a chroot and using pacman the remainder of the system is installed.

After the system installation has been finished some tweaks are made to the system to make it immutable compatible, this mostly involves moving certain directories such as `/opt` and `/usr/local` to `/var`, which is a separate subvolume from root and by default writable, and replacing them with a symlink. See the [technical overview page](/technical-overview/) for details on these changes.

Finally the `rootfs/`, `rootfs/etc` and `rootfs/var` subvolumes are locked, exported and compressed in to a tarball.

## Arkdep deploy

When deploying an image Arkdep will download this image from an online repository to its cache directory. When the download is done this image is extracted and the resulting datastreams are fed directory to btrfs receive to be deployed.

The `rootfs/etc` and `rootfs/var` subvolumes are then unlocked, user data is overlaid and files are migrated.

Now the kernel is installed to the ESP, and an initramfs is generated using Dracut.

Finally the deployment is added to the tracker file so Arkdep considers it to have been successfully installed and a bootloader entry for it is added to the ESP to make it bootable.

