# Arkdep-build usage

Do you like the technology but do not like the provided images? No problem! You can easily spin and deploy custom images should you desire to do so.

## File structure

```text
arkdep-build.d
├── customlinux			    # Directory carrying a custom name
|  ├── overlay              # (Optional) Parent directory of post_bootstrap and post_install overlays
|  |  ├── post_bootstrap	# (Optional) Root filesystem overlay directory, contents are copied to root after bootstrap step
|  |  ├── post_install  	# (Optional) Root filesystem overlay directory, contents are copied to root after package installation step
|  ├── bootstrap.list	    # Plain text file containing list of packages installed by pacstrap, used for installing the base system
|  ├── package.list		    # (Optional) Plain text file containing list of packages installed by pacman in a chroot, used for aditional package installations
|  ├── pacman.conf		    # (Optional) pacman configuration file to be used by pacstrap and pacman, is copied to the image after the bootstrap is done
|  ├── type         	    # Plain text file, for configs of the Arch type should contain `archlinux`
|  ├── update.sh            # (Optional) Script run by Arkdep to perform minor updates to the system
|  ├── extensions		    # (Optional) Directory for custom scripts
|     ├── post_bootstrap.sh     # (Optional) Custom bash script which runs after bootstrapping the system
|     ├── post_install.sh	    # (Optional) Custom bash script which runs after system installation is finished
|     ├── post_build.sh	        # (Optional) Custom bash script which runs after image creation is fully finished
```

- `bootstrap.list` contains a list of packages installed during the bootstrapping process using pacstrap.
- `package.list` contains a list of packages which will be installed after the bootstrapping process using a chrooted pacman.
- `type` is expected to be present but right now only accepts `archlinux` and `migration`, the file is used by arkdep-build to determine which method of building it should employ for the given configuration, in the future support for more distro families will be added.
- The contents of the subdirectories located in `overlay` are copied to root after their asociated build step completes, use the overlay to add custom config files or to enable systemd services.
- `extensions` and its children are optional, these are bash scripts run by arkdep-build if provided, they can be used to introduce custom functionality in to arkdep-build.

Note that `bootstrap.list` and `package.list` may not contain any whitespaces or special characters.

## Spinning a custom image

First make a copy of one of the existing arkdep-build configurations in to a directory named `arkdep-build.d`;

```console
mkdir arkdep-build.d
cp -r /etc/arkdep/test-arkanelinux-kde arkdep-build.d/
```

Next make your edits to the configuration files in `arkdep-build.d/test-arkanelinux-kde`, you may also rename the `test-arkanelinux-kde `configuration's directory, the name of the directory is used to build a specific image by name.

```console
mv arkdep-build.d/test-arkanelinux-kde arkdep-build.d/customlinux
```

Once all the desired changes have been made you can spin a new image by navigating to arkdep-build.d's parant directory and running arkdep-build.

```console
sudo arkdep-build customlinux
```

Once the image has finished building it will be placed inside of a directory called `target` located in the `arkdep-build.d` parent directory. To then install it without using an external repository copy the achive in to the `/arkdep/cache` directory and define cache as the image variant when doing a deployment.

```console
sudo cp target/aaabbbccc.tar.zst /arkdep/cache/
sudo arkdep deploy cache aaabbbccc
```

## Extensions

Arkdep-build is build in such a way that it maintains compatibility with existing software repositories, build extensions allow you to make changes to the system at various steps during the build process. Because Arkdep managed systems are not supposed to install packages using their native package manager after deployment you are free to move, remove or change anything in the system with no fear of breakages.

`post_bootstrap.sh` is sourced by Arkdep-build after it finished bootstrapping the base system and overlaying `overlay/post_bootstrap`.

`post_install.sh` is sourced by Arkdep-build after installing all system packages and overlaying `overlay/post_install` but before it performs generic modifications to the system to make it immutable compatible.

`post_build.sh` is sourced by Arkdep-build once the build is fully completed and exported, but before it performs a cleanup.

These scripts will have access to all the same information Arkdep-build utilizes for image creation.

| Variable | Usecase |
| --- | --- |
| `$build_image` | Location of virtual Btrfs disk |
| `$build_image_mountpoint` | The mountpoint of the build image filesystem |
| `$build_image_size` | Size of the build image in syntax accepted by fallocate |
| `$workdir` | Working directory to which the root filesystem is installed, typically set to `$build_image_mountpoint/rootfs` |
| `$variant` | Name of the image variant we are building, `arkdep-build.d/$variant` would resolve the variant configuration location |

## Update.sh

Update.sh is entirely optional, it can be utilized to perform minor system updates to components Arkdep does not manage. It behaves the same way as a migration, it only differs in that it is run as an extension of a normal deployment and it is indented to only perform minor non-invasive tweaks and changes to the system.

It has access to the following variables;

| Variable | Usecase |
| --- | --- |
| `${data[0]}` | The image name, eg. `aabbcc123` |
| `${data[1]}` | The tarball compression method, eg. `zst` |
| `${data[2]}` | Image SHA checksum |
| `$arkdep_dir` | Arkdep's location on the filesystem, eg. `/arkdep` |
| `$arkdep_boot` | The boot directory location on the filesystem, eg. `/boot` |

## Reference material

The primary Arkane Linux configuration and several testing one can be found on either [Github](https://github.com/arkanelinux/arkdep/tree/main/arkdep-build.d) or [Codeberg](https://codeberg.org/arkanelinux/arkdep/src/branch/main/arkdep-build.d). If you have Arkane Linux already installed these configs can also be found locally in `/etc/arkdep`.

To build one of these configs clone the repo, navigate to the root of the repo and run `arkdep-build arkanelinux`, or substitute `arkanelinux` with the name of another config.
