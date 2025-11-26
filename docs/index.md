# About Arkane Linux

Arkane Linux is an opinionated, immutable, atomic, Arch-based distibution which aims to provide a GNOME-centered experienced with minimal yet full featured and sensible non-intrusive defaults. It primarily serves as a reference implementation, development environment and my personal configuration of the Arkdep immutable system management toolkit.

# About Arkdep

Arkdep is the set of tools providing immutability to Arkane Linux. It attempts to differentiate itself from other immutable systems by being "stupidly simple", hackable, flexible, distro agnostic and easy to adopt for personal projects.

# Getting started

- If you are interested in learning how to use Arkdep as a user refer to the [Arkdep usage page](/arkdep-usage).
- If you want to learn how to build your own images refer to the [Arkdep-build usage page](/arkdep-build-usage).

# Special thanks

A very special thanks to the people who made sizable contributions to Arkane Linux making it what it is today.

<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://cdna.artstation.com/p/users/avatars/000/109/216/large/8939eb753b692b41a8292b46565d59b3.jpg?1578311068',
    name: 'Karina Plaksina',
    title: 'Artist',
    links: [
      { icon: 'artstation', link: 'https://www.artstation.com/brachium' }
    ]
  },
  {
    avatar: 'https://avatars.githubusercontent.com/u/5050022?v=4',
    name: 'Philip Müller',
    title: 'Contributor',
    links: [
      { icon: 'github', link: 'https://github.com/hphilm' },
      { icon: 'twitter', link: 'https://x.com/philmmanjaro' },
      { icon: 'discourse', link: 'https://forum.manjaro.org/u/philm/summary' }
    ]
  },
  {
    avatar: '/doggo.webp',
    name: 'Vinny',
    title: 'Chief Herding Officer',
    links: [
    ]
  },
]
</script>

<VPTeamMembers size="small" :members />
