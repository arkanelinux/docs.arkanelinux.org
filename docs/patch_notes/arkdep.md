# Arkdep patch notes

## 2024.03.29
- Each image now has its own unique `/var` directory
- System-wide Flatpak installs now stored in `/arkdep/shared/flatpak` subvolume
- `/root` is no longer a symlink to `/var/roothome`, it is now instead a subvolume stored in `/arkdep/shared/root`

To port to this breaking update do the following;
```console
btrfs subvolume create /arkdep/shared/flatpak
btrfs subvolume create /arkdep/shared/root
btrfs filesystem mkswapfile --size 6G /arkdep/shared/swapfile

Update /arkdep/overlay/etc/fstab;
- Remove /var entry
- Update swapfile entry to /arkdep/shared/swapfile
- Add /arkdep/shared/flatpak entry
- Add /arkdep/shared/root entry
```
