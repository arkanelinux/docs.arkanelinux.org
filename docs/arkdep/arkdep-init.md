# Set up Arkdep on a new system

System requirements;

- `/` is partitioned with btrfs
- `/boot` mounted boot partition
- 512MiB boot partition for max 2 deployments, 1GiB recommended
- Systemd-boot bootloader is installed and configured as the primary bootloader
- `dracut`, `wget`, `curl` and `btrfs-progs` are installed

System requirements for building images;

- `arch-install-scripts` and `btrfs-progs` are installed

The following command will initialize Arkdep, it will deploy a subvolume containing all Arkdep related files excluding kernels and initramfs to `/arkdep`. Kernel and initramfs will instead be stored in `/boot/arkdep` upon image deployment.

```shell
# To init on the current root
sudo arkdep init

# Alternatively to init in to a specific directory
# If boot dir is not mounted underneath $ARKDEP_ROOT/boot define it with ARKDEP_BOOT
# If needed disable bootctl commands with ARKDEP_NO_BOOTCTL=1 or by defining ARKDEP_BOOT
sudo ARKDEP_ROOT=/target/dir arkdep init
```

Once Ardep has been initialized you should prepare the overlay located at `/arkdep/overlay`. The overlay is copied directly on to the root filesystem of a new deployment, create directories inside of it as-if it were a root filesystem. For example, `/arkdep/overlay/etc` will be your `/etc` folder.

You will most likely wish to add the following to the overlay;

- passwd, shadow, group, subgid and subuid files containing only entries for root and normal user accounts, system accounts will be supplied via the images and are stored separate in `/usr/lib`.
- fstab file with at least a writable `/var` subvolume configured
- (Optional) A locale.conf/locale.gen, localtime symlink and customized dracut configuration
- (Optional) Customize the default Arkdep configuration at `/arkdep/config`

Here is a reference fstab file, take note of the `subvol` mount option;

```shell
LABEL=arkane_root	/home         	btrfs     	rw,relatime,ssd,discard=async,space_cache=v2,subvol=arkdep/shared/home,compress=zstd	0 0
LABEL=arkane_root	/root         btrfs     	rw,relatime,ssd,discard=async,space_cache=v2,subvol=arkdep/shared/root,compress=zstd	0 0
LABEL=arkane_root	/arkdep         btrfs     	rw,relatime,ssd,discard=async,space_cache=v2,subvol=arkdep,compress=zstd	0 0
LABEL=arkane_root	/var/lib/flatpak         btrfs     	rw,relatime,ssd,discard=async,space_cache=v2,subvol=arkdep/shared/flatpak,compress=zstd	0 0
```

To customize default kernel parameters edit `/arkdep/templates/systemd-boot`.
