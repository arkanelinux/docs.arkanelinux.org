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
