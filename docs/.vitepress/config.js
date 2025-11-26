const docsSidebar = [
	{
		text: 'Arkane Linux',
		items: [
			{ text: 'About', link: '/' },
			{ text: 'Lore', link: '/lore/' },
			{ text: 'Technical Overview', link: '/technical-overview/' },
		],
	},
	{
		text: 'Arkdep',
		items: [
			{ text: 'Arkdep usage', link: '/arkdep/usage/' },
			{ text: 'Arkdep-build usage', link: '/arkdep/arkdep-build-usage/' },
			{ text: 'Arkdep repository', link: '/arkdep/repository/' },
			{ text: 'Arkdep migrations', link: '/arkdep/migrations/' },
			{ text: 'Installation', link: '/arkdep/installation/' },
			{ text: 'How it works', link: '/arkdep/how-it-works/' },
		],
	},
	{
		text: 'Patch Notes',
		items: [
			{ text: 'arkdep', link: '/patch-notes/arkdep/' },
			{ text: 'Arkane Linux', link: '/patch-notes/arkanelinux/' },
			{ text: 'os-installer-arkdep', link: '/patch-notes/os-installer-arkdep/' },
		],
	},
]

export default {
  themeConfig: {
    siteTitle: 'Arkane Linux Docs',
		logo: '/arkanelinux-logo-3.svg',
		sidebar: {
			'/': docsSidebar,
		},
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/arkanelinux' },
      { icon: 'codeberg', link: 'https://codeberg.org/arkanelinux' },
      { icon: 'matrix', link: 'https://matrix.to/#/%23arkanelinux:matrix.org' }
    ],
  }
}
