# Arkane Linux lore

## Custom Arch ISO <Badge type="info" text="October 2022 - Januari 2023" />

Arkane started off with me exploring the Arch Linux build tools, initially Arkane was a simple customized Arch ISO with a GUI installer.

The first Arkane ISOs and installs were in configuration very similar to what Arkane still looks like today, a Fedora-esq default config, GNOME with all apps and features installed one would expect to have on a full featured desktop operating system, but nothing more than that.

## x86-64-v3 <Badge type="info" text="Januari 2023 - April 2023" />

Yet this little custom Arch ISO quickly spiraled out of control in to an attempting at a full x86-64-v3 rebuild of Arch, this experiment got to the point of actually having the first [bootable x86-64-v3](https://download.arkanelinux.org/archive/) images, after which point I stopped development because the tools I had build were deeply flawed.

The build tools were flawed due to a bug in Docker, very shortly after I started development on the "buildbot" tool Docker bugged which broke fakeroot, yet I decided to go ahead with the project anyway and just work around this issue. The results were predictable, applications were build in a polluted environment causing some to pull in additional dependencies.

## Immutability and atomicity <Badge type="info" text="June 2023 - Today" />

I was always a fan of immutable distros, I have used Fedora Silverblue since its initial release, and still happily run it today. So I decided to give immutability a try.

First I evaluated existing tools, the most serious contender at the time being ABRoot. But it lacked documentation, I could not figure out how to use it, and I didn't feel like joining their Discord to ask them how it worked.

So I started thinking myself how an immutable could be implemented, I knew Btrfs had subvolumes, so I did a web search to see if it was possible to boot in to a subvolume. The answer was yes. I manually performed the deployment process, installing an Arch system in to a subvolume with pacstrap, I set up a bootloader entry for it, and everything worked as expected. Now all I had to do was write tooling to perform subvolume exports and deploy them.

From here on all the pieces just started to fall in place and everything was put in to code, any issues I encountered were trivial to solve, an immutable is surprisingly easy to implement. This tool would through a few names (Bttrfs, Arkanium) before eventually becoming Arkdep.

## Manjaro Summit <Badge type="info" text="Februari 2024 - Today" />

I was approached by Philip Mueller from the Manjaro project, he was curious about the technology powering Arkane linux for he was looking at options to create some type of immutable and atomic variant of Manjaro for use on the [Orange Pi Neo](https://neo.manjaro.org/). He himself had already made an attempt at building such a system, but wasn't entirely happy with the results. I assisted him in improving Arkdep and to implement it for Manjaro, after several days of work we had the very first version of atomic Manjaro booting. This was then tweaked ion to something more suitable for gaming handhelds, this then became Manjaro Gaming Edition.

When we considered the technology stable enough, we decided to give the Manjaro community the ability to test-drive the tech. Initially called Manjaro Immutable later branded as Manjaro Summit, this experiment provided lots of valuable feedback on commonly requested features and bugs.

At time of writing, Manjaro Summit is on the backburner, I would like to get back to it at some point, but at this moment I sadly lack the time to properly maintain it.

The Orange Pi Neo sadly has not yet fully released 2 years later due to issues with the hardwarem, and only had a couple of small sample runs for early adopters. Another handheld, the [Zotac Gaming ZONE Pro](https://forum.manjaro.org/t/development-q-a-zotac-gaming-zone-pro/177928) might end up being the first to ship with Manjaro Gaming Edition if this all works out.
