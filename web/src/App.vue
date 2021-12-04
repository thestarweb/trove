<template>
	<su-view-control style="height: 100%">
		<su-page
			title="Trove Tool"
			:menu="[
				{
					title: $t('gem.title'),
					children: [
						{
							title: $t('gem.child-page.check.title'),
							path: '/gem/check',
						},
					],
				},
				{
					title: $t('lang.child-page.editer.title'),
					path: '/lang/editer',
				},
				{
					title: $t('mastery.title'),
					path: '/mastery',
				},
			]"
		>
			<template v-slot:header>
				<span>by star_ss</span>
			</template>
			<router-view/>
			新版重构中，当前版本 2.0.1
		</su-page>
	</su-view-control>
</template>

<style>
	html,body{
		margin: 0;
		padding: 0;
	}
	html,body,#app{
		height: 100%;
	}
	#app{
		background: #404;
		color: #CCC;
	}
	:root{
		--star-ui-backgorund-color:#404;
		--star-ui-font-color: #CCC;
	}
	/* 先这样临时解决下 */
	.su-page--main{
		flex: 1;
	}
</style>
