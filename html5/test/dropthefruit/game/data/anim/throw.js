var throwball = function() {
this.Skeleton = {
"bones": [
	{ "name": "closed" },
	{ "name": "ball", "parent": "closed", "x": -7.72, "y": -5.2 },
	{ "name": "open", "parent": "closed", "x": -0.05, "y": 21.5 }
],
"slots": [
	{ "name": "closed hand", "bone": "closed", "attachment": "closed hand" },
	{ "name": "open hand", "bone": "open", "attachment": "open hand" },
	{ "name": "ball", "bone": "ball", "attachment": "ball" }
],
"skins": {
	"default": {
		"ball": {
			"ball": { "x": 7.33, "y": 6.35, "rotation": 52.47, "width": 128, "height": 128 }
		},
		"closed hand": {
			"closed hand": { "width": 128, "height": 128 }
		},
		"open hand": {
			"open hand": { "x": -2.44, "y": -20.53, "width": 128, "height": 128 }
		}
	}
},
"animations": {
	"idle": {
		"bones": {
			"open": {
				"rotate": [
					{ "time": 0, "angle": -4.38 },
					{ "time": 0.1666, "angle": -18.25 },
					{ "time": 0.2333, "angle": -1.35 }
				],
				"translate": [
					{ "time": 0, "x": 1.6, "y": -0.54 },
					{ "time": 0.1666, "x": 7.84, "y": 10.3 },
					{ "time": 0.2, "x": 0, "y": 0.48 },
					{ "time": 0.2333, "x": -6.45, "y": -0.26 },
					{ "time": 0.5666, "x": 0, "y": 2.93 },
					{ "time": 0.6333, "x": 0, "y": 11.73 }
				]
			},
			"ball": {
				"rotate": [
					{ "time": 0, "angle": -4.38 },
					{ "time": 0.1666, "angle": -29.61 },
					{ "time": 0.2333, "angle": -8.01 },
					{ "time": 0.2666, "angle": -22.56 },
					{ "time": 0.4, "angle": 121.64 },
					{ "time": 0.5666, "angle": -65.06 }
				],
				"translate": [
					{ "time": 0, "x": -0.41, "y": 0.11 },
					{ "time": 0.1666, "x": 1.67, "y": 12.92 },
					{ "time": 0.2, "x": 0, "y": 0.48 },
					{ "time": 0.2333, "x": -0.51, "y": 5.73 },
					{ "time": 0.4333, "x": 0, "y": 53.79 },
					{ "time": 0.5666, "x": 0, "y": 10.75 },
					{ "time": 0.6333, "x": 0, "y": 19.55 }
				]
			},
			"closed": {
				"rotate": [
					{ "time": 0, "angle": 4.38 },
					{ "time": 0.1666, "angle": 18.25 },
					{ "time": 0.2333, "angle": 1.35 }
				],
				"translate": [
					{ "time": 0, "x": 0, "y": 0.48 },
					{ "time": 0.1666, "x": 0, "y": -11.24 },
					{ "time": 0.2333, "x": 0, "y": -0.48 },
					{ "time": 0.5666, "x": 0, "y": -2.93 },
					{ "time": 0.6333, "x": 0, "y": -11.73 },
					{ "time": 0.7, "x": 0, "y": 0.48, "curve": "stepped" },
					{ "time": 1.1333, "x": 0, "y": 0.48 }
				]
			}
		},
		"slots": {
			"ball": {
				"attachment": [
					{ "time": 0, "name": null },
					{ "time": 0.2666, "name": "ball" },
					{ "time": 0.5666, "name": null }
				]
			},
			"closed hand": {
				"attachment": [
					{ "time": 0.2666, "name": null },
					{ "time": 0.5666, "name": "closed hand" }
				]
			},
			"open hand": {
				"attachment": [
					{ "time": 0, "name": null },
					{ "time": 0.2666, "name": "open hand" },
					{ "time": 0.5666, "name": null }
				]
			}
		}
	},
	"thrown": {
		"slots": {
			"ball": {
				"attachment": [
					{ "time": 0, "name": null }
				]
			},
			"closed hand": {
				"attachment": [
					{ "time": 0, "name": null }
				]
			}
		}
	}
}
};
this.AtlasData = 
"\n" +
"throw.png\n" +
"format: RGBA8888\n" +
"filter: Linear,Linear\n" +
"repeat: none\n" +
"ball\n" +
"  rotate: false\n" +
"  xy: 123, 21\n" +
"  size: 64, 64\n" +
"  orig: 128, 128\n" +
"  offset: 23, 35\n" +
"  index: -1\n" +
"closed hand\n" +
"  rotate: false\n" +
"  xy: 2, 2\n" +
"  size: 119, 83\n" +
"  orig: 128, 128\n" +
"  offset: 9, 18\n" +
"  index: -1\n" +
"open hand\n" +
"  rotate: false\n" +
"  xy: 2, 87\n" +
"  size: 128, 112\n" +
"  orig: 128, 128\n" +
"  offset: 0, 15\n" +
"  index: -1\n" +
"\n";
}
