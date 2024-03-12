# Arkdep
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
