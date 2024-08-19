# Arkdep usage
This document will provide you with some example usage or Arkdep, and give you a technical overview of the detail and specifics of Arkane Linux's configuration.

Here is detailed the default configurion of an installed system, the configuration of the ISO installation images differs in various ways from a full proper install.

## Updating the system
The system is updated like so;

```console
sudo arkdep deploy
```

When the `deploy` parameter is passed without providing any further arguments Arkdep will read `/arkdep/config` and combine `$repo_url/$repo_default_image` to infer from where it is expected to download its images and which image variant it should download.

It will first download the database file at `$repo_url/$repo_default_image/database` and grab the very first entry in the list, the top most entry in the database file is assumed to be the latest image available.

## Deploying a specific image variant
A specific image variant can be pulled like so;

```console
sudo arkdep deploy test-arkanelinux-kde
```

Providing this extra argument will overwrite `$repo_default_image` allowing you to pull a different image variant from the same repository.

## Deploying a specific image version
Specific image versions can also be requested;

```console
sudo arkdep deploy test-arkanelinux-kde aaabbbccc
```

This argument will make it search the database file and download the first hit it finds.

If you are intend on pulling a specific version of the default image variant as defined in `$repo_default_image` the variant may be substituted with a `-`.

```console
sudo arkdep deploy - aaabbbccc
```

## Deploying local images
Any image present in `/arkdep/cache`, for example an image called `aaabbbccc.tar.zst`, can also be installed directly skipping the database download;

```console
sudo arkdep deploy cache aaabbbccc
```

## Rolling back deployments
Older deployments can always be booted in to using their systemd-boot bootloader entries.

Permanently rolling back to another image is done by manually calling systemd-boot's `bootctl` to set a specific config located in `/boot/loader/entries` as the default through EFI variables which are read by systemd-boot.

```console
sudo bootctl set-default aaabbbccc

# Or alternative to perform just a one-shot boot
sudo bootctl set-oneshot aaabbbccc
```

## Removing a deployment
Deployments which are not the currently active deployment can be manually removed.

For deployments to be removable the deployment has to be listed in the tracker file.

```console
sudo arkdep remove aaabbbccc
```

Impartial targets can be provided, if Arkdep has no more than a single hit the found deployment will be removed.

```console
sudo arkdep remove aaa
```

# Configuring Arkdep
Arkdep has several components which may be customized and configured.

- `/arkdep/config` is the config file used to overwrite behavior in the `arkdep` script
- `/arkdep/overlay` contains files to be copied to the root filesystem of a new deployment
- `/arkdep/keys` contains GnuPG keys used to validate image integrity
- `/arkdep/templates` contains configuration files which are copied and modified by Arkdep, right now this is only occupied by the systemd-boot bootloader entry template

None of the features mentioned here are used by `arkdep-build`, it runs entirely stand-alone.

## Config file
The config file is used to overwrite the default behavior of Arkdep or enable additional optional behavior. The file is a simple bash script which is sourced by Arkdep during its initialization stage and contains only shell variables.

The config file itself contains all available options and associated documentation.

Settings which are simple toggles only accept `0` for off and `1` for on unless otherwise specified.

Arkdep's optional and configurable features are not yet final, new features may be added at any time. When this is done Arkdep will fall back to a predefined default behavior if the associated variable is not yet defined in the config file and show a notice to the user when run.

## Overlay
The overlay folder contains files which are copied to the root filesystem of new deployments, it is primarily intended to load user specific configuration such as user accounts and fstab file in to new generic deployments. It may also be used to overwrite or extend the default configuration of programs in the provided images, for example to load specific kernel modules in to the initramfs by adding extra Dracut config files to the overlay.

The overlay should be structured as a root filesystem, for example `/arkdep/overlay/etc` will be your `/etc` directory in a new deployment.

If files are added to the overlay outside of `/arkdep/overlay/etc` arkdep will temporarily unlock the root filesystem for editing.

Certain locations on the filesystem are symlinked to `/var` for they need to be writable, to write files to these locations instead add them  to their `/var`-based directory.

| Directory | Actual location | Note |
| --- | --- | --- |
| `/opt` | `/var/opt` | |
| `/srv` | `/var/srv` | |
| `/usr/local` | `/var/usrlocal` | |
| `/usr/lib/locale` | `/var/usrliblocale` | |
| `/etc/NetworkManager/system-connections` | `/var/nm-system-connections` | Only if dir exists in image |

`/home`, `/root` and `/var/lib/flatpak` are shared directories which get mounted during boot, they are not available at image deploy time.

## Keys
Arkdep will if able attempt to verify image integrity and trust using GnuPG. For this behavior to trigger the following has to be true;

- GPG checking is not disabled in the config file
- A signature is successfully downloaded from the repos

A GPG signature is by default optional, if available Arkdep will use it instead of the sha checksum to verify image integrity. Arkdep can be configured to require these files to be provided by setting `gpg_signature_check` to `2` in the config file. If configured to require GPG checking Arkdep will error if the signature is not provided by the image repositories.

Keys can be exported and added to the keyring like so, this process can be repeated to add multiple keys;
```console
gpg --output example.gpg --export example@example.com
cat example.gpg | sudo tee -a /arkdep/keys/trusted-keys
```

## Templates
Right now Arkdep only uses templates to store a systemd-boot bootloader entry template. This template is a preconfigured bootloader entry in to which Arkdep inserts the deployment ID.

Any instances of `%target%` in this config file will be replaced with the deployment ID when Arkdep copies it to insert a new bootloader entry.
