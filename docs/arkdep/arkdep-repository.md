# Setting up an Arkdep repository
Arkdep can be used entirely locally, but it is also capable of pulling images from an external repository.

## Repository layout
This would be a suitable layout if `repo_url` in `/arkdep/config` is set to `https://repo.example.com/arkdep`.

```text
repo.example.com
├── arkdep
|  ├── customlinux
|  |  ├── database                          # Plain text file containing : delimited lists of all available images `image_name:compression_method:shasum`
|  |  ├── customlinux_v1.0.tar.zst          # Compressed disk images
|  |  ├── customlinux_v1.0.tar.zst.sig      # Detached GPG signature
|  |  ├── customlinux_v2.0.tar.zst	        # Compressed disk images
|  |  ├── customlinux_v2.0.tar.zst.sig	    # Detached GPG signature
|  ├── customlinux-gnome
|  |  ├── database
|  |  ├── customlinux-gnome_v1.0.tar.zst
|  |  ├── customlinux-gnome_v2.0.tar.zst
```

## Database file
The `database` file contains a `:` delimited list of all available images. Each line contains the following information `image_name:compression_method:shasum`.

The top most entry in the database is considered to the be latest available image, this image is pulled by default if no version is manually defined.

```console
customlinux_v2.0:zst:d5f45b2dac77399b37231c6ec4e864d184d35cf1
customlinux_v1.0:zst:80ba4c7f3ff7a0ebce8e67d5b73f87c56af1b9f3
```
The image name could be set to almost anything, the only requirements are that the name is unique and does not contain a delimiter character.

The compression method is flexible, any compression method tar can infer is supported. Some examples being `xz`, `gz` and `zst`.

The SHA checksum is used to ensure the file was downloaded properly. The goals of the SHA checksum is to quickly check the images for data corruption, not to ensure cryptographic integrity.

If a GPG signature is provided the checksum is unused.

SHA-1, SHA-224, SHA-256, SHA-384 and SHA-512 are all supported, arkdep will automatically infer which type is used.

An `-` might be inserted in to the checksum section of the list to skip the checksum check.

### Database entry generation script
Here is a helpful little script to quickly generate a database entry for a newly created image.

```console
#!/usr/bin/env bash

checksum=($(sha1sum ./target/*.tar.*))
file=$(basename $(ls ./target/*.tar.*))
compress=${file##*.}
id=${file%%.*}
echo "$id:$compress:${checksum[0]}"
```

# Signed images
A GPG signature is by default optional, if available Arkdep will use it instead of the checksum to verify image integrity. Arkdep can be configured to require these files to be provided by setting `gpg_signature_check` to `2` in the config file.

## Arkdep keyring
A keyring with trusted (private) keys is stored at `/arkdep/keys/trusted-keys`, keys are only accepted in binary format.

Keys can be exported and added to the keyring like so, this process can be repeated to add multiple keys;

```console
gpg --output example.gpg --export example@example.com
cat example.gpg | sudo tee -a /arkdep/keys/trusted-keys
```

## Generating a signature
Generate a signature like so;

```console
gpg --output customlinux_v1.0.tar.zst.sig --detach-sig customlinux_v1.0.tar.zst
```

Then simply drop these signatures next to disk image itself.

Arkdep assumes the signatures to be identical in name to their parent file with a .sig appended.

```console
097b11844383f9ff62367b54608f9153e3c30e9551.tar.zst
097b11844383f9ff62367b54608f9153e3c30e9551.tar.zst.sig
```
