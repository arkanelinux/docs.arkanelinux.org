# Quickstart

Arkane Linux is an immutable system, this means the root filesystem is read-only. It also does atomic updates, this means it does not overwrite your system when updating, it instead creates a new root filesystem and makes it bootable.

Unlike the behavior common to other immutable and atomic distros however, it is not a "hard" immutable, the system is flexible and allows you to unlock it at any time, after which you can use it just like any other Arch-based distribution.

## System updates

System deployments are managed by Arkdep, use it to perform system updates.

```shell
sudo arkdep deploy
```

## Installing software

To ensure the stability of the system, and to avoid breakages due to your images not being in the assumed state, it is generally recommended to not install packages unless you are familiar with the risks.

It is highly recommended to use Flatpak and containers (eg. Distrobox + Podman) to install applications and set up mutable workspaces.

When intend on making many changes it is best to [build your own images](/arkdep/arkdep-build-usage/) instead.

### Layering software

Arkdep can layer packages, it will keep track of a list of packages you wish to layer, and install these packages to your current deployment and any future deployments.

```shell
sudo arkdep layer firefox
```

### Ephemeral software

You can still install software like normal using `pacman`, however, any installed packages will not be transitioned over to a new image update.

```shell
sudo pacman -Syy firefox
```

## Adding users to groups

Arkane Linux uses two sets of passwd, group an shadow files, user accounts being located in `/etc/{passwd,shadow,group}` and system accounts in `/usr/lib/{passwd,shadow,group}`. The user account files are migrated to new deployments, the system accounts are not.

To add a user to a group first ensure the group is preset in the user files, if not, add it.

```shell
grep '^realtime:' /etc/group || echo "realtime:x:973:" | sudo tee -a /etc/group
```

Duplicate entries for groups in both the user and system files are allowed.

Now you can add users to said group like normal.

```shell
sudo usermod -aG realtime $USER
```

## Customizing system configuration

The `/etc` directory is writable, you are free to change any files inside of it. To make sure a file is backed up when updating add it to `migrate_files` in `/etc/arkdep/config`, or store a copy of it in `/arkdep/layer`.
