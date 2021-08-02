<template>
	<su-view-control style="height: 100%">
		<router-view/>
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
	}
</style>
