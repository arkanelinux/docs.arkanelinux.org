# How Arkdep works
Arkdep uses Btrfs subvolumes to manage the system. Subvolumes are build and exported with `arkdep-build`, then and afterwards deployed using `arkdep`.

The average user may only ever use `arkdep` if they are not intend on building their own images, it will act as a system update and deployment manager.

## How arkdep-build works
1. A 42 character long random string is generated which will be used as the image name.
1. Create a temporary image file at `/var/tpm/arkdep-build.img`.
1. Partition the image file with Btrfs.
1. Mount the image to `/var/tmp/arkdep-build`
1. Create `rootfs`, `rootfs/var` and `rootfs/etc` Btrfs subvolumes at `/var/tmp/arkdep-build`.
1. Use pacstrap and pacman to perform a traditional Arch Linux (Or Arch-based distro) install like normal.
1. After both the pacstrap and pacman steps it may overlay additional changes such as config files to the newly installed system, this is done by copying the contents of the configuration's overlay directory to the new root.
1. Temporarily mount the local pacman cache in to the new root so it can pull already cached packages from it.
1. After the core system installation a hand full of changes will be made to the system, notable ones of which include;
    - Various folders are moved to the `/var` subvolume and symlinked using relative paths
        - `/opt` is symlinked to `/var/opt`
        - `/srv` is symlinked to `/var/srv`
        - `/usr/local` is symlinked to `/var/usrlocal`
    - The local pacman cache will be wiped
    - passwd, shadow and group files are copied to `/usr/lib`, the root user is removed from these files
    - The /etc passwd, shadow and group files are changed to only contain the root user
    - CPU microcode is moved from `/boot` to `/usr/lib`
1. The subvolumes are all made read-only and exported with `btrfs send`.
1. Each subvolume is exported to its own image. The images follow the following naming scheme;

        de378c78bb4eaa4772849c066902c5af2a356939a6-etc.img
        de378c78bb4eaa4772849c066902c5af2a356939a6-rootfs.img
        de378c78bb4eaa4772849c066902c5af2a356939a6-var.img

1. These images are then all put in to a compressed tarball.

        de378c78bb4eaa4772849c066902c5af2a356939a6.tar.zst

## How arkdep deploy works
Lets assume we are performing a simple no-parameter-provided deployment with `arkdep deploy`.

2. It will download the datebase file from the external repository defined in `/arkdep/config`. This database file contains a colon delimited list with three pieces of information; the image name, the compression method and a SHA checksum. Here is an example of what a typical database file looks like;

        aa07d220f08ea7f6260bc94df075bdc27c3e992b48:zst:5821e16ec6ae668b2f07e66470f7df0cad4b7d02
        16cc78d054f2e5556ed96f7c3338e8102c3988a403:zst:3791f48a4785809011067e5c8064e5663ea4957c
        f99a83c9b0a2931b5b6cc7735f8544542aedb1a3d5:zst:fb55a7beb7e6d85681fa36148a9330aa9015b0c2
        edfa1f1ff4910669e457dba0a4350450ceb4805ed7:zst:de9d45011bef5fa6aaec26e981546c0a52c142ee
        8b9fef99f9a69396bc71e3ba629b376ff3ad80eb71:zst:24c177dd93ab602a5553cb9ee04e1f1b85397ed8

2. The topmost entry is assumed by Arkdep to be the latest version and it will be downloaded.
2. If the image is already in the Arkdep cache the download will be skipped. If a .run file exists for this image in cache the download will be resumed.
2. If configured to do so Arkdep will also attempt to download a gpg signature. If available, this signature is used to ensure the integrity of the download. If the signature can not be downloaded or this feature is disabled it will instead verify download integrity using the checksum provided in the database, if a GPG signature is configured to be required it will fail with an error.
2. The images will now be extracted and deployed one at a time. First rootfs which in this example is deployed to `/arkdep/deployments/aa07d220f08ea7f6260bc94df075bdc27c3e992b48/rootfs`, rootfs is temporarily unlocked to allow for the writing of the etc and var subvolumes. Then etc which is deployed to `rootfs/etc` and lastly var which is deployed to `rootfs/var`. The var and etc subvolumes are both unlocked before root is locked again.
2. `/arkdep/overlay` will be copied to the new deployment. If anything is added to the overlay other than an etc directory root will be temporarily unlocked to allow for these changes to be overlayed.
2. Files and folders defined in `migrate_files` setting will be copied from the current deployment to the new deployment.
2. Now that the deployment of the subvolumes is done Arkdep will add a systemd-boot bootloader entry for it in `/boot/loader/entries/`.
2. The vmlinuz from the first found kernel is copied to `/boot/arkdep/aa07d220f08ea7f6260bc94df075bdc27c3e992b48/vmlinuz`
2. Using dracut an initramfs is generated inside of the deployments unique boot directory.
2. If provided, scripts in `/arkdep/extensions` will be executed, these scripts can be used to apply additional changes or customization to your deployment and extend Arkdep's default behavior.
2. A tracker entry for the new deployment will be written to the `/arkdep/tracker` file, deployments listed inside of this file Arkdep will consider to be installed and under its management.
2. A bootloader entry is added to systemd-boot.
2. Using EFI variables the new bootloader entry is marked as default.
2. Arkdep may now perform a cleanup and old deployments outside of `deploy_keep`.
