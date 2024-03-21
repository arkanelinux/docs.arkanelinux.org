# Arkdep-build

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
|  ├── extensions		    # (Optional) Directory for custom scripts
|     ├── post_bootstrap.sh     # (Optional) Custom bash script which runs after bootstrapping the system
|     ├── post_install.sh	    # (Optional) Custom bash script which runs after system installation is finished
```

- `bootstrap.list` contains a list of packages installed during the bootstrapping process using pacstrap.
- `package.list` contains a list of packages which will be installed after the bootstrapping process using a chrooted pacman.
- `type` is expected to be present but right now only accepts `archlinux`, the file is used by arkdep-build to determine which method of building it should employ for the given configuration, in the future support for more distro families will be added.
- The contents of the subdirectories located in `overlay` are copied to root after their asociated build step completes, use the overlay to add custom config files or to enable systemd services.
- `extensions` and its children `post_bootstrap.sh` and `post_install.sh` are optional, these are bash scripts run by arkdep-build if provided, they can be used to introduce custom functionality in to arkdep-build.

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
