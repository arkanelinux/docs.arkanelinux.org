# Arkdep migrations

Through migrations Arkdep is capable of performing major configuration updates to the system without user intervention.

Migrations can be made for both major and minor config changes, to ensure a user does not skip a migration they should be the last update provided for a variant, eg. `customlinux`. Once a migration is completed you should switch the user over to a new branch such as `customlinux-v2` by changing `repo_default_image` in the `/arkdep/config` file.

# Arkdep deploy

If `arkdep deploy` detects the presence of a migration script in a downloaded tarball it will trigger special migration specific behavior and not do a deployment. All it will do when this happens is extract `migration.sh` and source the file. It will then expect the migration script to perform all the work.

# Arkdep-build configuration

Migration images are build using arkdep-build just like normal images, they are unique in that they trigger special migration specific behavior in both `arkdep-build` and `arkdep deploy`.

## File structure

Note that `migration.sh` and `migration` will get a unique random ID prepended to the filename before they are written in to a tarball to avoid file conflicts.

```text
arkdep-build.d
├── customlinux-v2-migration	# Directory carrying a custom name
|  ├── migration.sh             # Bash script which will perform the migration
|  ├── migration                # (Optional) Directory containing miscellaneous files to be included in the image
|  ├── type         	        # Plain text file, for configs of the migration type should contain `migration`
```

## migration.sh

This is the only file which Arkdep will extract when a migration is run, other files will remain in the tarball and have to be manually extracted when needed.

The migration shell script is expected by Arkdep to do all the actual work in a migration. It will have access to all the same information Arkdep utilizes for normal image deployments.

| Variable | Usecase |
| --- | --- |
| `${data[0]}` | The image name, eg. `aabbcc123` |
| `${data[1]}` | The tarball compression method, eg. `zst` |
| `${data[2]}` | Image SHA checksum |
| `$arkdep_dir` | Arkdep's location on the filesystem, eg. `/arkdep` |
| `$arkdep_boot` | The boot directory location on the filesystem, eg. `/boot` |

## Example migration.sh

```console
# Create a directory
mkdir $arkdep_dir/overlay/etc/zsh

# Extract a specific file from the tarball to a specific location,
# in this example we are adding a new zshrc to Arkdep's overlay
tar -xf $arkdep_dir/cache/${data[0]}.tar.${data[0]} \
    -C $arkdep_dir/overlay/etc/zsh \
    ./${data[0]}-migration/zshrc

# We did our big migration, lets switch over to the next major version of the OS
sed -i '/repo_default_image/c\repo_default_image="customlinux-v2"' $arkdep_dir/config


#
## You may wish to update the system now, or maybe not and instead let the user manually update
#

# Lets update the system with our new migration done
# We are doing the update in a new clean shell
bash -c "arkdep deploy"
```
