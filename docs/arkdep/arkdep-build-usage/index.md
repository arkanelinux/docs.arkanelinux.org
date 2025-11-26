# Arkdep-build usage

Do you like the technology but do not like the provided images? No problem! You can easily build and deploy custom images should you desire to do so.

## File structure

### File structure archlinux type

```text
arkdep-build.d
├── customlinux             # Directory carrying a custom name
   ├── overlay              # (Optional) Parent directory of post_bootstrap and post_install overlays
   |  ├── post_bootstrap    # (Optional) Root filesystem overlay directory, contents are copied to root after bootstrap step
   |  ├── post_install      # (Optional) Root filesystem overlay directory, contents are copied to root after package installation step
   ├── bootstrap.list       # Plain text file containing list of packages installed by pacstrap, used for installing the base system
   ├── package.list         # (Optional) Plain text file containing list of packages installed by pacman in a chroot, used for aditional package installations
   ├── depends.list         # (Optional) Plain text file containing filepaths of other variants used to extend package lists and overlays of current variant
   ├── pacman.conf          # (Optional) pacman configuration file to be used by pacstrap and pacman, is copied to the image after the bootstrap is done
   ├── type                 # Plain text file, for configs of the Arch type should contain `archlinux`
   ├── name.sh              # (Optional) Bash script, is sourced if available, output is used as image name
   ├── update.sh            # (Optional) Script run by Arkdep to perform minor updates to the system
   ├── extensions           # (Optional) Directory for custom scripts
      ├── pre_build.sh          # (Optional) Custom bash script which runs after the Btrfs subvolumes have been created
      ├── post_bootstrap.sh     # (Optional) Custom bash script which runs after bootstrapping the system
      ├── post_install.sh       # (Optional) Custom bash script which runs after system installation is finished
      ├── post_build.sh         # (Optional) Custom bash script which runs after image creation is fully finished
```

### File structure debian type

> [!WARNING] ⚠ Debian support is very experimental.

```text
arkdep-build.d
├── customlinux             # Directory carrying a custom name
   ├── overlay              # (Optional) Parent directory of post_bootstrap and post_install overlays
   |  ├── post_bootstrap    # (Optional) Root filesystem overlay directory, contents are copied to root after bootstrap step
   |  ├── post_install      # (Optional) Root filesystem overlay directory, contents are copied to root after package installation step
   ├── package.list         # (Optional) Plain text file containing list of packages installed by apt in a chroot, used for aditional package installations
   ├── depends.list         # (Optional) Plain text file containing filepaths of other variants used to extend package lists and overlays of current variant
   ├── apt.conf             # Plain text file, contains repo URL and package suite, eg. `http://deb.debian.org/debian sid`
   ├── type                 # Plain text file, for configs of the Debian type should contain `debian`
   ├── name.sh              # (Optional) Bash script, is sourced if available, output is used as image name
   ├── update.sh            # (Optional) Script run by Arkdep to perform minor updates to the system
   ├── extensions           # (Optional) Directory for custom scripts
     ├── pre_build.sh          # (Optional) Custom bash script which runs after the Btrfs subvolumes have been created
     ├── post_bootstrap.sh     # (Optional) Custom bash script which runs after bootstrapping the system
     ├── post_install.sh       # (Optional) Custom bash script which runs after system installation is finished
     ├── post_build.sh         # (Optional) Custom bash script which runs after image creation is fully finished
```

## Building a custom image

First make a copy of one of the existing arkdep-build configurations in to a directory named `arkdep-build.d`;

```shell
mkdir arkdep-build.d
cp -r /etc/arkdep/test-arkanelinux-kde arkdep-build.d/

# Alternatively, Git clone the latest version from the Arkdep repos
git clone https://github.com/arkanelinux/arkdep.git
```

Next make your edits to the configuration files in `arkdep-build.d/test-arkanelinux-kde`, or another configuration of your choosing. You may also rename the `test-arkanelinux-kde` directory.

```shell
mv arkdep-build.d/test-arkanelinux-kde arkdep-build.d/customlinux
```

Once all the desired changes have been made you can build a new image by navigating to arkdep-build.d's parant directory and running arkdep-build.

```shell
sudo arkdep-build customlinux
```

The image will now start building, when it has finished the final image will be placed inside of a directory called `target` located in the `arkdep-build.d` parent directory. To then install it without using an external repository copy the achive in to the `/arkdep/cache` directory and define cache as the image variant when doing a deployment.

```shell
sudo cp target/aaabbbccc.tar.zst /arkdep/cache/
sudo arkdep deploy cache aaabbbccc
```

## Variant configuration

Almost anything may be removed or customized from the stock config according to your own preferences. However the system depends on `libnss-extrausers` and the `/etc/nsswitch.conf` to load the system user accounts stored in `/usr/lib/{passwd,shadow,group}`. An alternative implementation would be nss-altfiles, which is utilized by Fedora Silverblue for this same purpose.

### Extensions

Arkdep-build is written in such a way that it maintains compatibility with existing distro software repositories, it request no immutable-aware packages to function.

Build extensions allow you to make changes to the system at various steps during the build process, they can be used to make changes to the operating system as a workaround to the limitations of traditional distros when being forced in to an immutable context. Because Arkdep managed systems are not supposed to install packages using their native package manager after deployment you are free to move, remove or change anything in the system with no fear of breakages.

Build extensions are typically not required, the main Arkdep-build script should have compatibility with most, if not all, distros within a distro family. However odd software configurations not supported by Arkdep-build may require manual intervention to function in an immutable context or during the build stage, for this you can use build extensions.

Extensions are placed in the `arkdep-build.d/test-arkanelinux-kde/extensions/` directory, there are three scripts which Arkdep-build will source during the build process if available.

- `extensions/pre_build.sh` is sourced by Arkdep-build after creating the Btrfs subvolume hierarchy to which the system will be installed, but runs before the system is bootstrapped.
- `extensions/post_bootstrap.sh` is sourced by Arkdep-build after it finished bootstrapping the base system and overlaying `overlay/post_bootstrap`.
- `extensions/post_install.sh` is sourced by Arkdep-build after installing all system packages and overlaying `overlay/post_install/` but before it performs generic modifications to the system to make it immutable compatible.
- `extensions/post_build.sh` is sourced by Arkdep-build once the build is fully completed and exported, but before it performs a cleanup.

These scripts will have access to all the same information Arkdep-build utilizes for image creation.

| Variable                  | Usecase
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `$build_image`            | Location of virtual Btrfs disk.                                                                                        |
| `$build_image_mountpoint` | The mountpoint of the build image filesystem.                                                                          |
| `$build_image_size`       | Size of the build image in syntax accepted by fallocate.                                                               |
| `$workdir`                | Working directory to which the root filesystem is installed, typically set to `$build_image_mountpoint/rootfs`.        |
| `$variant`                | Name of the image variant we are building, `arkdep-build.d/$variant` would resolve the variant configuration location. |
| `$variantdir`             | Location of variant.                                                                                                   |

### Update.sh

Update.sh is used to perform minor changes to the system or handle minor breaking updates.
| Variable       | Explanation                                                 |
| -------------- | ----------------------------------------------------------- |
| `${data[0]}`   | The image name, eg. `aabbcc123`                             |
| `${data[1]}`   | The tarball compression method, eg. `zst`                   |
| `${data[2]}`   | Image SHA checksum, could be any SHA variant                |
| `$arkdep_dir`  | Arkdep's location on the filesystem, eg. `/arkdep`          |
| `$arkdep_boot` | The boot directory location on the filesystem, eg. `/boot`. |

### Dependencies

Using `depends.list` Arkdep-build variants can define other variants as dependencies, these dependencies will extend the package lists and overlays of said variant with the contents of the defined variants.

The `depends.list` file contains file paths pointing at other variants located inside of arkdep-build.d, multiple dependencies can be defined.

```text
test-arkanelinux-kde
depends/arkanelinux-common
```

## Reference material

The primary Arkane Linux configuration and several testing one can be found on either [Github](https://github.com/arkanelinux/arkdep/tree/main/arkdep-build.d) or [Codeberg](https://codeberg.org/arkanelinux/arkdep/src/branch/main/arkdep-build.d). If you have Arkane Linux already installed these configs can also be found locally in `/etc/arkdep`.

To build one of these configs clone the repo, navigate to the root of the repo and run arkdep-build arkanelinux, or substitute arkanelinux with the name of another config.
