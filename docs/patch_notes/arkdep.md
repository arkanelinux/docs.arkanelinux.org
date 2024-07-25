# Arkdep patch notes

## 2024.07.26
- Perform cleanup on migration and update scripts
- Fix delete action asking for confirmation when deploy has been called

## 2024.07.17
- Implement interactive mode
- Add `ARKDEP_CONFIRM` to allow for the skipping of interactive prompts
- Implement diff option

## 2024.07.05
- `get-available` now scrapes available variants from the web page, list file has been dropped
- `backup_user_accounts` now enabled by default

## 2024.05.24
- Miscellaneous code cleanup, fixes and refactors
- Default deploy\_keep changed to 3
- arkdep-build now checks if sufficient storage is available before building

## 2024.05.01
- Add option to remove tarball after deployment is finished
- Btrfs receive now reads images from stdin instead of from disk
- Add support for migrations
- A tiny bit of code and terminal output cleanup
- arkdep-build now performs builds inside of a disk image

## 2024.04.21
- Documentation has been moved to manpages
- Prevent the system from sleeping during image download
- Handle user interupts during deployments
- Refuse user interupts while writing images to disk
- Add `load_extensions` feature for arkdep deploy
- Various code cleanup and refactors

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
- Add subvol=arkdep/shared/flatpak entry mounted to /var/lib/flatpak
- Add subvol=arkdep/shared/root entry mounted to /root
```
