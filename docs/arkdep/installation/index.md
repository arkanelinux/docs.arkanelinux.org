# Installing Arkdep on a new system

## System requirements

- `/` is partitioned with btrfs.
- `/boot` mounted boot partition.
- 512MiB boot partition for max 2 deployments, 1GiB recommended.
- Systemd-boot bootloader is installed and configured as the primary bootloader.
- `dracut`, `wget`, `curl`, `gnupg` and `btrfs-progs` are installed.

# Image building system requirements

- `arch-install-scripts` and `btrfs-progs` are installed.
- `debootstrap` is installed for `debian` variants builds.

# Initializing Arkdep

The following command will initialize Arkdep, it will deploy a subvolume containing all Arkdep related files excluding kernels and initramfs to /arkdep. Kernel and initramfs will instead be stored in /boot/arkdep upon image deployment.

```shell
# To init on the current root
sudo arkdep init

# Alternatively to init in to a specific directory
sudo ARKDEP_ROOT=/target/dir arkdep init

# If the ESP is not mounted underneath $ARKDEP_ROOT/boot, manually define it with ARKDEP_BOOT
sudo ARKDEP_ROOT=/target/dir ARKDEP_BOOT=/target/boot arkdep init
```

## Prepping the overlay

Once Ardep has been initialized you should prepare the overlay located at `/arkdep/overlay`. The overlay is copied directly on to the root filesystem of a new deployment, create directories inside of it as-if it were a root filesystem. For example, `/arkdep/overlay/etc` will be your `/etc` folder.

Add the following files to the overlay;

- `etc/passwd`, `etc/shadow`, `etc/group`, `etc/subgid` and `etc/subuid` files containing only entries for root and normal user accounts, system accounts will be supplied via the images and are stored separate in /usr/lib.
- fstab file with at least `/home`, `/root` and `/arkdep` mounts configured, see the reference below.
- (Optional) A `etc/locale.conf`, `etc/locale.gen` and `etc/localtime` symlink.
- (Optional) Customize the default Arkdep configuration at `/arkdep/config`.

```text
LABEL=arkane_root   /home               btrfs   rw,relatime,subvol=arkdep/shared/home,compress=zstd     0 1
LABEL=arkane_root	/root               btrfs   rw,relatime,subvol=arkdep/shared/root,compress=zstd	    0 1
LABEL=arkane_root	/arkdep             btrfs   rw,relatime,subvol=arkdep,compress=zstd                 0 1
LABEL=arkane_root	/var/lib/flatpak    btrfs   rw,relatime,subvol=arkdep/shared/flatpak,compress=zstd  0 1
```

## Kernel parameters

To customize default kernel parameters edit `/arkdep/templates/systemd-boot`

## For distro maintainers

At the top of the `arkdep` script are defined as variables the defaults for the script. These defaults are used as a fallback and when initializing a new system for Arkdep. As a distro maintainer who is packaging Arkdep for their own project you will likely wish to customize these settings to match your preferences and repository configuration.

You can find a reference pkgbuild file [here](https://github.com/arkanelinux/pkgbuild/tree/main/arkdep).
