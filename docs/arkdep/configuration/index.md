# Arkdep configuration

## Overview

Arkdep has several components which may be customized and configured to change its behavior.

- `/arkdep/config` is the config file used to defined behavior of the Arkdep script.
- `/arkdep/overlay` contains files to be copied to the root filesystem of a new deployment.
- `/arkdep/keys` contains GnuPG keys used to validate image integrity.
- `/arkdep/templates` contains configuration files which are copied and modified by Arkdep, right now this is only occupied by the systemd-boot bootloader entry template.

`arkdep-build` has no configuration file, it runs entirely stand-alone.

### /arkdep/config

The config file is used to overwrite the default behavior of Arkdep or enable additional optional behavior. The file is a simple bash script which is sourced by Arkdep during its initialization stage and contains only shell variables.

The config file itself contains all available options and associated documentation.

Settings which are simple toggles only accept `0` for off and `1` for on, unless specified otherwise.

If a variable is not defined in the config file Arkdep will revert back to hard-coded default settings.

### /arkdep/overlay

The `/arkdep/overlay` folder contains files which are copied to the root filesystem of new deployments, it is primarily intended to load user specific configuration such as user accounts and fstab file in to new otherwise generic deployments. It may also be used to overwrite or extend the default configuration of programs in the provided images, for example to enable extra systemd services by adding a corresponding symlink to `/etc/systemd/system`, or to add a customized `/etc/ssh/sshd_config` file to any new deployment.

The overlay should be structured as a root filesystem, for example `/arkdep/overlay/etc` will be your `/etc` directory in a new deployment.

If files are added to the overlay outside of `/arkdep/overlay/etc` arkdep will temporarily unlock the root filesystem for editing.

Certain locations on the filesystem are symlinked to `/var` for they need to be writable, to write files to these locations instead add them to their `/var`-based directory.

An alternative to the overlay is `migrate_files`, this is an option available in `/arkdep/config`.

| Directory    | Actual location |
| ------------ | --------------- |
| `/opt`       | `/var/opt`      |
| `/srv`       | `/var/srv`      |
| `/usr/local` | `/var/usrlocal` |

`/home`, `/root` and `/var/lib/flatpak` are shared directories which get mounted during boot, they can thus not be written to or backed up at deploy time.

## GPG keys

Arkdep will, if able, attempt to verify image integrity and trust using GnuPG. For this behavior to trigger the following has to be true;

- GPG checking is not disabled in the config file.
- A key is installed at `/arkdep/keys/trusted-keys`.
- A signature is successfully downloaded from the repos.

A GPG signature is by default optional, if available Arkdep will use it instead of the sha checksum to verify image integrity. Arkdep can be configured to require these files to be provided by setting `gpg_signature_check` to `2` in the config file. If configured to require GPG checking Arkdep will error if the signature is not provided by the image repositories.

Keys can be exported and added to the keyring like so, this process can be repeated to add multiple keys;

```shell
gpg --output example.gpg --export example@example.com
cat example.gpg | sudo tee -a /arkdep/keys/trusted-keys
```

## Bootloader templates

Right now Arkdep only uses templates to store a systemd-boot bootloader entry template. This template is a preconfigured bootloader entry in to which Arkdep inserts the deployment ID.

Any instance of `%target%` in this config file will be replaced with the deployment ID when Arkdep copies it to install a new bootloader entry for a newly deployed image.

### Bootloader configuration template updates

Arkdep will update templates if `auto_update_templates` is enabled. It will compare files locate at `.../usr/lib/arkdep/templates` in any new deployment against the ones currently installed in `/arkdep/templates`, if they do not match the Arkdep configuration will be updated to the one provided with the new image deployment.
