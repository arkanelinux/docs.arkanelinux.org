# Arkdep usage

## Updating the system

```shell
sudo arkdep deploy
```

When the `deploy` parameter is passed without providing any further arguments Arkdep will read `/arkdep/config` and combine `$repo_url/$repo_default_image` to infer from where it is expected to download its images and which image variant it should download.

In this example no specific version is specified, it will first download the database file at `$repo_url/$repo_default_image/database` and grab the very first entry in the list, the top most entry in the database file is assumed to be the latest image available.

## Deploying a specified image variant

```shell
sudo arkdep deploy test-arkanelinux-kde
```

Providing this extra argument will overwrite `$repo_default_image` allowing you to pull a different image variant from the default repository.
Deploying a specified image version
sudo arkdep deploy test-arkanelinux-kde aaabbbccc

When specifying a version it will search the database file and download the first version matching the provided pattern.

If you are intend on pulling a specific version of the default image variant as defined in `$repo_default_image` the variant may be substituted with a `-`.

```shell
sudo arkdep deploy - aaabbbccc
```

## Deploying images from cache

Any image already stored in `/arkdep/cache`, for example an image called `aaabbbccc.tar.zst`, can also be installed straight from cache. This can be utilized to deploy custom images build locally.

```shell
sudo arkdep deploy cache aaabbbccc
```

## Removing a deployment

Deployments which are not the currently active deployment can be manually removed. For deployments to be removable the deployment has to be listed in the `/arkdep/tracker` file.

```shell
sudo arkdep remove aaabbbccc
```

Impartial targets can be provided, if Arkdep has no more than a single hit the found deployment will be removed.

```shell
sudo arkdep remove aaa
```

## Layering packages

Layered packages are installed using the system package manager on top of image deployments. It is recommended to avoid this feature because it infringes on the stability of the images.

When a package is layered it will be installed to the current deployment and any future deployments.

To avoid hard breakages, package layering will be skipped should it run in to an error at deploy time.

```shell
sudo arkdep layer chromium
```

Multiple packages to be layered can be provided at the same time.

```shell
sudo arkdep layer chromium firefox
```

Current packages which are layered can be listed using the following command. Note that it does not validate the layered tracker against the current deployment, upon a rollback packages which are to be layered but are not in the current deployment will still be listed as layered despite not being installed on the current deployment.

```shell
sudo arkdep layer-ls
```

When a package is unlayered it is removed from the current deployment and will no longer be installed to any future deployments.

```shell
sudo arkdep unlayer chromium
```

## Configuring Arkdep

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

## Templates

Right now Arkdep only uses templates to store a systemd-boot bootloader entry template. This template is a preconfigured bootloader entry in to which Arkdep inserts the deployment ID.

Any instance of `%target%` in this config file will be replaced with the deployment ID when Arkdep copies it to install a new bootloader entry for a newly deployed image.
