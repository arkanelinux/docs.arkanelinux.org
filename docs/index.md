# About Arkane Linux
Arkane Linux is an immutable distro based on Arch Linux featuring atomic system updates. It utilizes a custom toolkit called Arkdep to build, deploy and maintain a collection of deployments each one being a full Arkane Linux installation. If a new deployment has a bug or some other issues you can easily fall back to an older deployment, if an update were to somehow fail or be interupted no changes will be made to the system.

Arkane Linux tries to differentiate itself from other immutable distros by providing an easy to use toolkit to spin your own custom images. The documentation provided here serves to assist you in familiarizing yourself with Arkane Linux and Arkdep.

Arkane Linux primarily serves as a reference implementation, development environment and my personal configuration of the Arkdep immutable system management toolkit.

## Getting started
- If you are interested in learning how to use Arkdep as a user refer to the [Arkdep usage page](/arkdep/arkdep/).
- If you want to learn how to build your own images refer to the [Arkdep-build usage page](/arkdep/arkdep-build/).
- If you want to learn how to set up an image repository refer to the [Arkdep repository page](/arkdep/arkdep-repository).

## The story so far
Arkane started off with me exploring the Arch Linux build tools, once again impressed by the flexibility of Arch and its toolstack I quickly decided to take it further and mature this experiment in to a proper Arch Linux-based distro. And this is the point at which we are now, Arkane is taking shape nicely and nearing the beta stage.

It started off as an attempt at making a full rebuild of Arch for x86-64-v3, a hugely fun project but the scripts written for it were (knowingly, Docker broke fakeroot right when I started the project) written with major architectural flaws. A full revision of all work was required to which means effectively redoing the entire buildbot project.

Before I could seriously undergo this attempt at rewriting buildbot I started to think about immutability and its theoretical implementation. In theory implementing it should be trivial, so I attempted a manual configuration of such a setup and it was a huge success! After a couple of months of slowly writing Arkdep (initially named bttrfs, later Arkanium) I had all the basics implemented.

November 2023, about 1 year after the start of the project, I have done a "release", the software is now in such a state that it should be stable. I have every intention to continue maintaining Arkane and Arkdep, but will anyone other than me ever actually use it? Only the future could tell.

March 2024, some people have actually starting using Arkane or have share an interest in using Arkdep as a tool to manage their own personal configurations or even their own distros.

## The future
The current and only goal I will set is to persue the continued development and refinement of Arkane and Arkdep, and to stamp out any lingering bugs with the endgoal of eventually making a proper Arkdep release once I consider it stable.

## Special thanks
A huge thank you to Karina Plaksina [(Brachium)](https://www.artstation.com/brachium) for creating the logo and wallpaper artwork.

## Links

- [Github](https://github.com/arkanelinux) - Primary Git repositories
- [Codeberg](https://codeberg.org/arkanelinux) - Secondary Git repositories
- [Download](https://download.arkanelinux.org/) - Arkane Linux ISO hosting
- [Arkane repo](https://repo.arkanelinux.org/) - Pacman software and Arkdep image repositories
- [Matrix channel](https://matrix.to/#/%23arkanelinux:matrix.org) - The easiest way to have a quick chat or get support
